#include "stdafx.h"
#include <string>
#include <iostream>
#include <fstream>
#include <cmath>
#include <vector>
#include <thread>
#include <unordered_map>
#include "external_dependencies/json.hpp"
#include "external_dependencies/ctpl_stl.h"
#include "algorithms/Simple.h"

using namespace std;
using json = nlohmann::json;

struct Trade {
	double price;
	size_t quantity;
	Action action;
	size_t timestamp;
};

struct Result {
	unordered_map<string, double> params;
	vector<Trade> trades;
	double profit;
};

struct Day {
	string date;
	vector<double> quotes;
	vector<int> timestamps;
	vector<Result> results;
};

void split(const string&, string[]);
void addQuotes(const double, const double, const double, const double, unique_ptr<Day>&);
void loadUltimateFile(vector<Day>&, const string&);
void backtestAlgo(vector<Day>&, json&, ctpl::thread_pool&, const string& algoName);
void throwException(const string& message);
void uploadResults(const vector<Day>&, const string&, const string&);
unordered_map<string, vector<string>> parseArgs(int, char*[]);
unique_ptr<Algorithm> getAlgo(const string&, const unordered_map<string, double>&);
void simulateDay(double&, Result&, unique_ptr<Algorithm>&, Day&);
bool handleAction(Result&, double&, Action&, double, size_t, size_t&, Trade&, bool&);
void runParamCombos(size_t, vector<string>&, vector<vector<double>>&, unordered_map<string, double>, const string&, vector<Day>&,
	ctpl::thread_pool& tp, vector<future<void>>&);

const double commission = 5; // amount in dollars for selling a stock
const size_t marketOpenTime = 34'200'000; // milliseconds equivalent to 9h30
const size_t marketCloseTime = 57'600'000; // milliseconds equivalent to 16h00
const size_t lineElementCount = 5; // 5 = number of elements we want in a line of an ultimate file (time, open, high, low, close)

int main(int argc, char* argv[]) {
	unordered_map<string, vector<string>> args = parseArgs(argc, argv);
	const string algoName = args["--algoName"][0];
	vector<string> tickers = args["--tickers"];

	const string configFilePath = "algorithms/configs/" + algoName + ".json";
	
	ifstream i(configFilePath);
	json config;
	i >> config;

	/* One task per ticker will be queued, and each one of those tasks will queue up several other tasks (max 8 total) and then
	block. 8 = 1 thread per core. When each thread per ticker blocks, we still want one thread per core to be active, so we
	have 8 + tickers.size threads in the pool. */
	ctpl::thread_pool tp(8 + tickers.size());
	vector<future<void>> taskReturns;
	for (const string &ticker : tickers) {
		taskReturns.push_back(
		tp.push([&](int id) {
			const string ultimateFile = "ultimate_files/" + ticker + ".txt";
			vector<Day> days;
			loadUltimateFile(days, ultimateFile);
			cout << "DATA LOADED FOR " + ticker << endl;
			backtestAlgo(days, config, tp, algoName);
			uploadResults(days, ticker, algoName);
		}));
	}
	
	for (future<void> &result : taskReturns) {
		result.get();
	}
	cout << "Press any key to continue...\n";
	getchar();
	return 0;
}

unordered_map<string, vector<string>> parseArgs(int argc, char* argv[]) {
	unordered_map<string, vector<string>> args;
	args["--algoName"] = {};
	args["--tickers"] = {};

	for (int i = 1; i < argc - 1;) {
		if (args.find(argv[i]) == args.end()) {
			throw invalid_argument(string(argv[i]) + " is an unrecognized argument");
		}

		int j = i + 1;
		for (; j < argc; ++j) {
			if (((string)argv[j]).find("--") != std::string::npos) {
				break;
			}
			args[argv[i]].push_back(argv[j]);
		}

		i = j;
	}

	return args;
}

void loadUltimateFile(vector<Day>& days, const string& ultimateFile) {
	cout << "Loading " + ultimateFile + " ...\n";
	ifstream ultimateFileStream;
	ultimateFileStream.open(ultimateFile);
	if (!ultimateFileStream) {
		throwException("Couldn't open the ultimate file:" + ultimateFile);
	}
		
	string upLine;
	unique_ptr<Day> day = make_unique<Day>();
	getline(ultimateFileStream, upLine);
	day->date = upLine.substr(upLine.size() - 8, 8);

	while (getline(ultimateFileStream, upLine)) {
		if (upLine.find("new day") != string::npos) {
			days.push_back(*day);
			day = make_unique<Day>();
			day->date = upLine.substr(upLine.size() - 8, 8);
		}
		else {
			string lineInfo[lineElementCount];
			split(upLine, lineInfo);
			
			int timestamp = stoi(lineInfo[0]);
			day->timestamps.push_back(timestamp);
			
			double open, high, low, close;
			open = atof(lineInfo[1].c_str());
			high = atof(lineInfo[2].c_str());
			low = atof(lineInfo[3].c_str());
			close = atof(lineInfo[4].c_str());
			addQuotes(open, high, low, close, day);
		}
	}

	ultimateFileStream.close();
}

void split(const string& line, string lineInfo[]) {
	char* charLine = new char[line.size() + 1];
	const char* tempCharLine = line.c_str();
	strcpy_s(charLine, line.size() + 1, tempCharLine);
	char* nextToken = NULL;
	char* pch = strtok_s(charLine, ",", &nextToken);
	lineInfo[0] = pch; // time

	pch = strtok_s(NULL, ",", &nextToken);
	for (size_t i = 1; pch != NULL && i < lineElementCount; ++i) {
		lineInfo[i] = pch;
		pch = strtok_s(NULL, ",", &nextToken);
	}
	delete[] charLine;
}

void addQuotes(const double open, const double high, const double low, const double close, unique_ptr<Day>& day) {
	day->quotes.push_back(open);
	double closeRatio = abs(close - low / close - high);
	double openRatio = abs(open - low / open - high);

	if (openRatio < closeRatio) {
		day->quotes.push_back(low);
		day->quotes.push_back(high);
	}
	else {
		day->quotes.push_back(high);
		day->quotes.push_back(low);
	}

	day->quotes.push_back(close);
}

void backtestAlgo(vector<Day>& days, json& config, ctpl::thread_pool& tp, const string& algoName) {
	unordered_map<string, double> params;
	vector<string> rangeNames;
	vector<vector<double>> ranges;
	for (json::iterator it = config.begin(); it != config.end(); ++it) {
		try {
			vector<double> range = it.value().get<vector<double>>();
			ranges.push_back(range);
			rangeNames.push_back(it.key());
		}
		catch (domain_error) {
			params[it.key()] = it.value().get<double>();
		}
	}

	if (params.find("timeBufferStart") == params.end()) {
		params["timeBufferStart"] = 0;
	}
	if (params.find("timeBufferEnd") == params.end()) {
		params["timeBufferEnd"] = 0;
	}

	vector<future<void>> taskReturns;
	runParamCombos(0, rangeNames, ranges, params, algoName, days, tp, taskReturns);

	for (future<void> &result : taskReturns) {
		result.get();
	}
}

void runParamCombos(size_t i, vector<string>& rangeNames, vector<vector<double>>& ranges, unordered_map<string, double> params,
					const string& algoName, vector<Day>& days, ctpl::thread_pool& tp, vector<future<void>>& taskReturns) {
	double start = ranges[i][0];
	double end = ranges[i][1];
	double increment = ranges[i][2];

	while (start <= end) {
		params[rangeNames[i]] = start;
		if (i == ranges.size() - 1) {
			taskReturns.push_back(
			tp.push([&](int id) {
				cout << "Running a simulation...\n";
				unique_ptr<Algorithm> algo = getAlgo(algoName, params);
				Result result;
				result.params = params;
				for (Day day : days) {
					result.trades.clear();
					double currentCash = result.params["cash"];
					simulateDay(currentCash, result, algo, day);
					result.profit = currentCash - result.params["cash"];
					day.results.push_back(result);
				}
			}
			));
		} 
		else {
			runParamCombos(i + 1, rangeNames, ranges, params, algoName, days, tp, taskReturns);
		}
		start += increment;
	}
}

void simulateDay(double& currentCash, Result& result, unique_ptr<Algorithm>& algo, Day& day) {
	double currentQuote;
	size_t currentTime;
	size_t stockUnits = 0;
	bool activePositions = false;
	Action action;
	Trade trade;
	bool keepTrading = false;

	for (size_t i = 0; i < day.quotes.size(); ++i) {
		currentTime = day.timestamps[i/4];
		currentQuote = day.quotes[i];
		if (currentTime < marketOpenTime + result.params["timeBufferStart"]) {
			continue;
		}

		if (currentTime > marketCloseTime - result.params["timeBufferEnd"]) {
			action = sell;
		}
		else {
			action = algo->processQuote(currentQuote);
		}

		keepTrading = handleAction(result, currentCash, action, currentQuote, currentTime, stockUnits, trade, activePositions);
		if (!keepTrading) {
			break;
		}
	}
}

bool handleAction(Result& result, double& currentCash, Action& action, double currentQuote, size_t currentTime, size_t& stockUnits,
				  Trade& trade, bool& activePositions) {
	if (action != nop) {
		stockUnits = (size_t)(((currentCash - result.params["maxLossPerTrade"]) / result.params["margin"]) / currentQuote);
		trade.quantity = stockUnits;
		trade.price = currentQuote;
		trade.timestamp = currentTime;
		trade.action = action;
	}

	if (action == buy && !activePositions) {
		activePositions = true;
		currentCash -= trade.price * trade.quantity;
		result.trades.push_back(trade);
	}
	else if (action == sell && activePositions) {
		activePositions = false;
		currentCash += trade.price * trade.quantity - commission;
		result.trades.push_back(trade);

		if (currentCash < result.params["minimumCash"]) {
			return false;
		}
	}

	return true;
}

void uploadResults(const vector<Day>& days, const string& ticker, const string& algoName) {
	//TODO: upload results contained in days to database (PostgreSQL)
}

unique_ptr<Algorithm> getAlgo(const string& algoName, const unordered_map<string, double>& params) {
	if (algoName.compare("simple") == 0) {
		return make_unique<Simple>();
	}
	throwException("Algorithm with name " + algoName + " is not implemented.");
}

void throwException(const string& message) {
	cout << message << endl;
	throw 20;
}

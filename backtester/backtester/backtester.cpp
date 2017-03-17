#include "stdafx.h"
#include <string>
#include <iostream>
#include <fstream>
#include <cmath>
#include <vector>
#include <thread>
#include <unordered_map>
#include <mutex>
#include <ctime>
#include "external_dependencies/json.hpp"
#include "external_dependencies/ctpl_stl.h"
#include "algorithms/Simple.h"
#include "models/models.h"

#ifdef DEBUG 
#define log cout 
#else
#define log / ## / cout 
#endif

using namespace std;
using json = nlohmann::json;
using Trade = trade_ns::Trade;
using Result = result_ns::Result;

void buildParamCombos(json&, vector<unordered_map<string, double>>&);
string buildbacktesterRootDir(char*);
void split(const string&, string[], const char*);
void addQuotes(const double, const double, const double, const double, Day&, size_t);
void loadUltimateFile(vector<Day>&, const string&);
void backtestAlgo(vector<Day>&, ctpl::thread_pool&, const string&, mutex&, const string&, vector<unordered_map<string, double>>&);
void throwException(const string& message);
void uploadResults(const vector<Day>&, const string&, const string&, mutex&, unordered_map<string, double>&, vector<Result>&);
void parseArgs(int, char*[], unordered_map<string, vector<char*>>&);
unique_ptr<Algorithm> getAlgo(const string&, const unordered_map<string, double>&);
void simulateDay(double&, double&, Result&, unique_ptr<Algorithm>&, Day&, unordered_map<string, double>&);
bool handleAction(Result&, double&, double&, Action&, Quote&, Trade&, bool&, unordered_map<string, double>&);
void runSimulation(int id, const string&, unordered_map<string, double>&, vector<Day>&, vector<Result>&);
void runParamCombos(size_t, vector<string>&, vector<vector<double>>&, unordered_map<string, double>, const string&, vector<Day>&,
	ctpl::thread_pool& tp, vector<future<void>>&, mutex&, const string&);
void paramCombosRecursion(size_t i, vector<string> &rangeNames, vector<vector<double>> &ranges, unordered_map<string, double> &params,
	vector<unordered_map<string, double>> &paramCombos);

const int quoteDivFactor = 10'000; // by how much we need to divide the quotes to represent them in dollars
const double commission = 5; // amount in dollars for selling a stock
const size_t lineElementCount = 5; // 5 = number of elements we want in a line of an ultimate file (time, open, high, low, close) 

int main(int argc, char* argv[]) {
	std::clock_t startTime;
	double backtestDuration;
	startTime = clock();

	const string backtesterRootDir = buildbacktesterRootDir(argv[0]);
	unordered_map<string, vector<char*>> args;
	parseArgs(argc, argv, args);
	const string algoName = args["--algoName"][0];
	vector<char*> tickers = args["--tickers"];
	json config;

	if (args["--params"].size() > 0) {
		config = json::parse(args["--params"][0]);
	}
	else {
		ifstream i(backtesterRootDir + "/algorithms/configs/" + algoName + ".json");
		i >> config;
	}

	vector<unordered_map<string, double>> paramCombos;
	buildParamCombos(config, paramCombos);
	cout << paramCombos.size() * tickers.size() << endl; // communicating to the server how many simulations will run

	/* One task per ticker will be queued, and each one of those tasks will queue up several other tasks (max 8 total) and then
	block. 8 = 1 thread per core. When each thread per ticker blocks, we still want one thread per core to be active, so we
	have 8 + tickers.size threads in the pool. */
	ctpl::thread_pool tp(8 + tickers.size());
	vector<future<void>> taskReturns;
	mutex(m);
	for (auto &ticker : tickers) {
		taskReturns.push_back(
			tp.push([&](int id) {
				const string ultimateFile = backtesterRootDir + "/ultimate_files/" + ticker + ".txt";
				vector<Day> days;
				loadUltimateFile(days, ultimateFile);
				log << "DATA LOADED FOR " + ticker << endl;
				backtestAlgo(days, tp, algoName, m, ticker, paramCombos);
		}));
	}
	
	for (auto &result : taskReturns) {
		result.get();
	}
	
	backtestDuration = (clock() - startTime) / (double)CLOCKS_PER_SEC;
	cout << "Backtester done." << endl;
	cout << "Backtest duration: " << backtestDuration << endl;
	log << "Number of simulations ran: " << paramCombos.size() * tickers.size() << endl;
	return 0;
}

string buildbacktesterRootDir(char* exeDir) {
	string dir = exeDir;
	size_t sectionRemoveCount = 2;
	size_t endPos = dir.length() - 1;
	char c;

	for (size_t i = 0; i < sectionRemoveCount; --endPos) {
		c = dir.at(endPos);
		if (c == '/' || c == '\\') {
			++i;
		}
	}

	return dir.substr(0, endPos+1);
}

void parseArgs(int argc, char* argv[], unordered_map<string, vector<char*>> &args) {
	args["--algoName"] = {};
	args["--tickers"] = {};
	args["--params"] = {};

	for (int i = 1; i < argc - 1;) {
		if (!args.count(argv[i])) {
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
}

void buildParamCombos(json &config, vector<unordered_map<string, double>> &paramCombos) {
	vector<string> rangeNames;
	vector<vector<double>> ranges;
	unordered_map<string, double> params;

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

	paramCombosRecursion(0, rangeNames, ranges, params, paramCombos);
}

void paramCombosRecursion(size_t i, vector<string> &rangeNames, vector<vector<double>> &ranges, unordered_map<string, double> &params,
						  vector<unordered_map<string, double>> &paramCombos) {
	double start = ranges[i][0];
	double end = ranges[i][1];
	double increment = ranges[i][2];

	while (start <= end) {
		params[rangeNames[i]] = start;
		if (i == ranges.size() - 1) {
			paramCombos.push_back(params);
		}
		else {
			paramCombosRecursion(i + 1, rangeNames, ranges, params, paramCombos);
		}
		start += increment;
	}
}

void loadUltimateFile(vector<Day> &days, const string &ultimateFile) {
	log << "Loading " + ultimateFile + " ...\n";
	ifstream ultimateFileStream;
	ultimateFileStream.open(ultimateFile);
	if (!ultimateFileStream) {
		throwException("Couldn't open the ultimate file:" + ultimateFile);
	}
		
	string upLine;
	string lineInfo[lineElementCount];
	size_t timestamp;
	Day day;
	double open, high, low, close;
	getline(ultimateFileStream, upLine);
	day.date = upLine.substr(upLine.size() - 8, 8);

	while (getline(ultimateFileStream, upLine)) {
		if (upLine.find("new day") != string::npos) {
			day.quotes[day.quotes.size() - 1].lastOfTheDay = true;
			days.push_back(day);
			day.quotes.clear();
			day.date = upLine.substr(upLine.size() - 8, 8);
		}
		else {
			split(upLine, lineInfo, ",");
			timestamp = stoi(lineInfo[0]);
			open = atof(lineInfo[1].c_str()) / quoteDivFactor;
			high = atof(lineInfo[2].c_str()) / quoteDivFactor;
			low = atof(lineInfo[3].c_str()) / quoteDivFactor;
			close = atof(lineInfo[4].c_str()) / quoteDivFactor;
			addQuotes(open, high, low, close, day, timestamp);
		}
	}

	ultimateFileStream.close();
}

void split(const string &line, string lineInfo[], const char* delimiter) {
	char* charLine = new char[line.size() + 1];
	const char* tempCharLine = line.c_str();
	strcpy_s(charLine, line.size() + 1, tempCharLine);
	char* nextToken = NULL;
	char* pch = strtok_s(charLine, ",", &nextToken);
	lineInfo[0] = pch; // time

	pch = strtok_s(NULL, ",", &nextToken);
	for (size_t i = 1; pch != NULL && i < lineElementCount; ++i) {
		lineInfo[i] = pch;
		pch = strtok_s(NULL, delimiter, &nextToken);
	}
	delete[] charLine;
}

void addQuotes(const double open, const double high, const double low, const double close, Day &day, size_t timestamp) {
	Quote quote;
	quote.timestamp = timestamp;
	quote.price = open;
	day.quotes.push_back(quote);
	double closeRatio = abs((close - low) / (close - high));
	double openRatio = abs((open - low) / (open - high));

	if (openRatio < closeRatio) {
		quote.price = low;
		day.quotes.push_back(quote);
		quote.price = high;
		day.quotes.push_back(quote);
	}
	else {
		quote.price = high;
		day.quotes.push_back(quote);
		quote.price = low;
		day.quotes.push_back(quote);
	}
	quote.price = close;
	day.quotes.push_back(quote);
}

void backtestAlgo(vector<Day> &days, ctpl::thread_pool &tp, const string &algoName, mutex &m, const string &ticker,
				  vector<unordered_map<string, double>> &paramCombos) {
	vector<future<void>> futures;
	
	for (auto &params : paramCombos) {
		futures.push_back(
			tp.push([&](int id) {
				vector<Result> results;
				runSimulation(0, algoName, params, days, results);
				uploadResults(days, ticker, algoName, m, params, results);
		}));
	}

	for (auto &future : futures) {
		future.get();
	}
}

void runSimulation(int id, const string &algoName, unordered_map<string, double> &params, vector<Day> &days, vector<Result> &results) {
	log << "Running a simulation...\n";
	unique_ptr<Algorithm> algo = getAlgo(algoName, params);
	Result result;
	double cumulativeCash = params["cash"];
	double dailyCashReset;
	double dailyCashNoReset;
	result.cumulativeProfitNoReset = 0;
	result.cumulativeProfitReset = 0;

	for (Day &day : days) {
		result.trades.clear();
		dailyCashReset = params["cash"];
		dailyCashNoReset = cumulativeCash;
		simulateDay(dailyCashReset, dailyCashNoReset, result, algo, day, params);
		result.dailyProfitReset = dailyCashReset - params["cash"];
		result.dailyProfitNoReset = dailyCashNoReset - cumulativeCash;
		cumulativeCash = dailyCashNoReset;
		result.cumulativeProfitNoReset += result.dailyProfitNoReset;
		result.cumulativeProfitReset += result.dailyProfitReset;
		results.push_back(result);
	}
}

void simulateDay(double &dailyCashReset, double &dailyCashNoReset, Result &result, unique_ptr<Algorithm> &algo, Day &day,
				 unordered_map<string, double> &params) {
	bool activePositions = false;
	Action action;
	Trade trade;
	bool keepTrading = false;

	for (auto &quote : day.quotes) {
		action = algo->processQuote(quote);
		keepTrading = handleAction(result, dailyCashReset, dailyCashNoReset, action, quote, trade, activePositions, params);
		if (!keepTrading) {
			break;
		}
	}
}

bool handleAction(Result &result, double &dailyCashReset, double &dailyCashNoReset, Action &action, Quote &quote, Trade &trade,
				  bool &activePositions, unordered_map<string, double> &params) {
	if (action != nop) {
		trade.price = quote.price;
		trade.timestamp = quote.timestamp;
		trade.action = action;
	}

	if (action == buy && !activePositions) {
		activePositions = true;
		trade.quantityReset = (dailyCashReset * (1 - params["maxLossPerTrade"])) / params["margin"] / quote.price;
		trade.quantityNoReset = (dailyCashNoReset * (1 - params["maxLossPerTrade"])) / params["margin"] / quote.price;
		dailyCashReset -= trade.price * trade.quantityReset;
		dailyCashNoReset -= trade.price * trade.quantityNoReset;
		result.trades.push_back(trade);
	}
	else if (action == sell && activePositions) {
		activePositions = false;
		dailyCashReset += trade.price * trade.quantityReset - commission;
		dailyCashNoReset += trade.price * trade.quantityNoReset - commission;
		result.trades.push_back(trade);
		trade.quantityReset = 0;
		trade.quantityNoReset = 0;

		if (dailyCashReset < dailyCashReset * (1 - params["maxDailyLoss"])) {
			return false;
		}
	}
	return true;
}

void uploadResults(const vector<Day> &days, const string &ticker, const string &algoName, mutex &m,
				   unordered_map<string, double> &params, vector<Result> &results) {
	json j_sim;
	j_sim["params"] = json(params);
	j_sim["ticker"] = ticker;
	j_sim["profitReset"] = results.back().cumulativeProfitReset;
	j_sim["profitNoReset"] = results.back().cumulativeProfitNoReset;
	json j_resList;

	for (size_t i = 0; i < results.size(); ++i) {
		json j_res;
		j_res["date"] = days[i].date;
		j_res["result"] = json(results[i]);
		j_resList.push_back(j_res);
	}

	j_sim["results"] = j_resList;
	
	unique_lock<mutex> lock(m);
	cout << j_sim << endl;
	lock.unlock();
}

unique_ptr<Algorithm> getAlgo(const string &algoName, const unordered_map<string, double> &params) {
	if (algoName.compare("simple") == 0) {
		return make_unique<Simple>(params);
	}

	throwException("Algorithm with name " + algoName + " is not implemented.");
}

void throwException(const string &message) {
	cout << message << endl;
	throw 20;
}

#include "stdafx.h"
#include "algorithms/Simple.h"
#include "TickerBacktester.h"

using namespace std;
using json = nlohmann::json;
using Trade = trade_ns::Trade;
using Result = result_ns::Result;

TickerBacktester::TickerBacktester(string &ticker, const string &backtesterRootDir, const string &algoName) {
	this->algoName = algoName;
	this->ticker = ticker;
	const string ultimateFile = backtesterRootDir + "/ultimate_files/" + ticker + ".txt";
	loadUltimateFile(ultimateFile);
}

TickerBacktester::~TickerBacktester() {
}

// Gets all the quotes information from the ultimate files and loads it in memory.
void TickerBacktester::loadUltimateFile(const string &ultimateFile) {
	ifstream ultimateFileStream;
	ultimateFileStream.open(ultimateFile);
	if (!ultimateFileStream) {
		throw runtime_error("Couldn't open the ultimate file:" + ultimateFile);
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
			day.quotes.back().lastOfTheDay = true;
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

// Splits a string separated by a comma and stores the separated strings in the lineInfo string array.
void TickerBacktester::split(const string &line, string lineInfo[], const char* delimiter) {
	char* charLine = new char[line.size() + 1];
	const char* tempCharLine = line.c_str();
	strcpy_s(charLine, line.size() + 1, tempCharLine);
	char* nextToken = NULL;
	char* pch = strtok_s(charLine, delimiter, &nextToken);
	lineInfo[0] = pch; // time

	pch = strtok_s(NULL, delimiter, &nextToken);
	for (size_t i = 1; pch != NULL && i < lineElementCount; ++i) {
		lineInfo[i] = pch;
		pch = strtok_s(NULL, delimiter, &nextToken);
	}
	delete[] charLine;
}

// Quotes are added to each corresponding day. The logic present in the function is to determine if the high must be added before the low and
// vice versa.
void TickerBacktester::addQuotes(const double open, const double high, const double low, const double close, Day &day, size_t timestamp) {
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

void TickerBacktester::backtestAlgo(ctpl::thread_pool &tp, vector<unordered_map<string, double>> &paramCombos, mutex &m) {
	vector<future<void>> futures;

	for (auto &params : paramCombos) {
		futures.push_back(
			tp.push([&](int id) {
				vector<Result> results;
				runSimulation(ref(params), ref(results));
				sendResults(ref(params), ref(results), ref(m));
			})
		);
	}

	for (auto &future : futures) {
		future.get();
	}
}

void TickerBacktester::runSimulation(unordered_map<string, double> &params, vector<Result> &results) {
	unique_ptr<Algorithm> algo = getAlgo(params);
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

unique_ptr<Algorithm> TickerBacktester::getAlgo(const unordered_map<string, double> &params) {
	if (algoName.compare("simple") == 0) {
		return make_unique<Simple>(params);
	}

	throw invalid_argument("Algorithm with name " + algoName + " is not implemented.");
}

void TickerBacktester::simulateDay(double &dailyCashReset, double &dailyCashNoReset, Result &result, unique_ptr<Algorithm> &algo, Day &day,
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

// Initiates trades based on actions returned by an algorithm. Returns a boolean to determine if we should keep trading or not based on
// the maximum daily loss constraint.
bool TickerBacktester::handleAction(Result &result, double &dailyCashReset, double &dailyCashNoReset, Action &action, Quote &quote, Trade &trade,
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

// Serializes all the results for a simulation and sends them through stdout to the server for database upload.
void TickerBacktester::sendResults(unordered_map<string, double> &params, vector<Result> &results, mutex &m) {
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
		j_resList.push_back(move(j_res));
	}

	j_sim["results"] = j_resList;
	lock_guard<mutex> lock(m);
	cout << j_sim << endl;
}

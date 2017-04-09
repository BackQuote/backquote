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
			day.closingTime = day.quotes.back().timestamp < marketCloseTime ? day.quotes.back().timestamp : marketCloseTime;
			day.openingTime = day.quotes.front().timestamp > marketOpenTime ? day.quotes.front().timestamp : marketOpenTime;
			days.push_back(day);
			day.quotes.clear();
			day.date = upLine.substr(upLine.size() - 8, 8);
		}
		else {
			split(upLine, lineInfo, ",");
			timestamp = stoi(lineInfo[0]);

			if (timestamp >= marketOpenTime && timestamp <= marketCloseTime) {
				open = atof(lineInfo[1].c_str()) / quoteDivFactor;
				high = atof(lineInfo[2].c_str()) / quoteDivFactor;
				low = atof(lineInfo[3].c_str()) / quoteDivFactor;
				close = atof(lineInfo[4].c_str()) / quoteDivFactor;
				addQuotes(open, high, low, close, day, timestamp);
			}
		}
	}

	ultimateFileStream.close();

	day.closingTime = day.quotes.back().timestamp < marketCloseTime ? day.quotes.back().timestamp : marketCloseTime;
	day.openingTime = day.quotes.front().timestamp > marketOpenTime ? day.quotes.front().timestamp : marketOpenTime;
	days.push_back(day);
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
				double lowestCumulativeProfitReset = 0;
				runSimulation(ref(params), ref(results), ref(lowestCumulativeProfitReset));
				sendResults(ref(params), ref(results), ref(m), ref(lowestCumulativeProfitReset));
			})
		);
	}

	for (auto &future : futures) {
		future.get();
	}
}

void TickerBacktester::runSimulation(unordered_map<string, double> &params, vector<Result> &results, double &lowestCumulativeProfitReset) {
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
		if (result.cumulativeProfitReset < lowestCumulativeProfitReset) {
			lowestCumulativeProfitReset = result.cumulativeProfitReset;
		}
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

	Action action;
	Trade trade;
	Status status;

	for (auto &quote : day.quotes) {
		status = algo->checkStatus(dailyCashReset, quote, trade, day);
		if (status == tooEarly) {
			continue;
		}
		else if (status == stopTrading) {
			action = sell;
		}
		else {
			assert(status == canTrade);
			if ((algo->activePositions && algo->tradeInBounds(dailyCashReset, quote, trade)) || !algo->activePositions) {
				action = algo->processQuote(quote);
				if ((action == buy && algo->activePositions) || (action == sell && !algo->activePositions)) {
					action = doNothing;
				}
			}
			else {
				action = sell;
			}
		}

		if (action != doNothing) {
			handleAction(result, dailyCashReset, dailyCashNoReset, action, quote, trade, algo);
		}

		if (status == stopTrading) break;
	}
}

// Initiates trades based on actions returned by an algorithm. Returns a boolean to determine if we should keep trading or not based on
// the maximum daily loss constraint.
void TickerBacktester::handleAction(Result &result, double &dailyCashReset, double &dailyCashNoReset, Action &action, Quote &quote, Trade &trade,
	unique_ptr<Algorithm> &algo) {

	trade.price = quote.price;
	trade.timestamp = quote.timestamp;
	trade.action = action;

	if (action == buy) {
		algo->activePositions = true;
		double purchasingPower = (dailyCashReset * (1 - algo->params["maxLossPerTrade"])) / algo->params["margin"];
		if (purchasingPower < dailyCashReset) {
			purchasingPower = dailyCashReset;
		}
		trade.quantityReset = purchasingPower / quote.price;
		purchasingPower = (dailyCashNoReset * (1 - algo->params["maxLossPerTrade"])) / algo->params["margin"];
		if (purchasingPower < dailyCashNoReset) {
			purchasingPower = dailyCashNoReset;
		}
		trade.quantityNoReset = purchasingPower / quote.price;
		dailyCashReset -= trade.price * trade.quantityReset;
		dailyCashNoReset -= trade.price * trade.quantityNoReset;
		result.trades.push_back(trade);
	}
	else if (action == sell) {
		algo->activePositions = false;
		dailyCashReset += trade.price * trade.quantityReset - commission;
		dailyCashNoReset += trade.price * trade.quantityNoReset - commission;
		result.trades.push_back(trade);
		trade.quantityReset = 0;
		trade.quantityNoReset = 0;
	}
}

// Serializes all the results for a simulation and sends them through stdout to the server for database upload.
void TickerBacktester::sendResults(unordered_map<string, double> &params, vector<Result> &results, mutex &m, double &lowestCumulativeProfitReset) {
	json j_sim;
	j_sim["params"] = json(params);
	j_sim["ticker"] = ticker;
	j_sim["profitReset"] = results.back().cumulativeProfitReset;
	j_sim["profitRateReset"] = results.back().cumulativeProfitReset / params["cash"];
	j_sim["profitNoReset"] = results.back().cumulativeProfitNoReset;
	j_sim["profitRateNoReset"] = results.back().cumulativeProfitNoReset / params["cash"];
	double profitRateNoTrading = ((days.back().quotes.back().price / days.front().quotes.front().price) - 1);
	j_sim["profitNoTrading"] = profitRateNoTrading * params["cash"];
	j_sim["profitRateNoTrading"] = profitRateNoTrading;
	j_sim["walletNeededForReset"] = lowestCumulativeProfitReset < 0 ? params["cash"] - lowestCumulativeProfitReset : params["cash"];

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

#include "stdafx.h"
#include "algorithms/Simple.h"
#include "TickerBacktester.h"

using namespace std;
using json = nlohmann::json;
using Trade = trade_ns::Trade;
using Result = result_ns::Result;

TickerBacktester::TickerBacktester(const string &ticker, const string &backtesterRootDir, const string &algoName) {
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
    double lineInfo[LINE_ELEMENT_COUNT];
    size_t timestamp;
    Day day;
    double open, high, low, close;
    getline(ultimateFileStream, upLine);
    day.date = upLine.substr(upLine.find(NEW_DAY_DELIMITER)+2, DATE_LENGTH);

    while (getline(ultimateFileStream, upLine)) {
        if (upLine.find("new day") != string::npos) {
            day.closingTime = day.quotes.back().timestamp < MARKET_CLOSE_TIME ? day.quotes.back().timestamp : MARKET_CLOSE_TIME;
            day.openingTime = day.quotes.front().timestamp > MARKET_OPEN_TIME ? day.quotes.front().timestamp : MARKET_OPEN_TIME;
            days.push_back(day);
            day.quotes.clear();
            day.date = upLine.substr(upLine.find(NEW_DAY_DELIMITER)+2, DATE_LENGTH);
        }
        else {
            split(upLine, lineInfo, ',');
            timestamp = (size_t)lineInfo[0];
            if (timestamp >= MARKET_OPEN_TIME && timestamp <= MARKET_CLOSE_TIME) {
                open = lineInfo[1] / QUOTE_DIV_FACTOR;
                high = lineInfo[2] / QUOTE_DIV_FACTOR;
                low = lineInfo[3] / QUOTE_DIV_FACTOR;
                close = lineInfo[4] / QUOTE_DIV_FACTOR;
                addQuotes(open, high, low, close, day, timestamp);
            }
        }
    }

    ultimateFileStream.close();

    day.closingTime = day.quotes.back().timestamp < MARKET_CLOSE_TIME ? day.quotes.back().timestamp : MARKET_CLOSE_TIME;
    day.openingTime = day.quotes.front().timestamp > MARKET_OPEN_TIME ? day.quotes.front().timestamp : MARKET_OPEN_TIME;
    days.push_back(day);
}

// Splits a string separated by a comma and stores the separated strings in the lineInfo string array.
void TickerBacktester::split(const string &line, double lineInfo[], const char delimiter) {
    stringstream ss;
    ss.str(line);
    string token;
    size_t tokenIndex = 0;
    while (getline(ss, token, delimiter)) {
        if (tokenIndex == LINE_ELEMENT_COUNT) {
            break;
        }
        lineInfo[tokenIndex++] = stod(token);
    }
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

// Running one simulation per parameter combination and sending the results to the parent process
void TickerBacktester::backtestAlgo(ctpl::thread_pool &tp, vector<unordered_map<string, double>> &paramCombos, mutex &m) {
    vector<future<void>> futures;

    for (auto &params : paramCombos) {
        futures.push_back(
                tp.push([&](int id) {
                    vector<Result> results;
                    double lowestCumulativeProfitReset = 0;
                    runSimulation(params, results, lowestCumulativeProfitReset);
                    sendResults(params, results, m, lowestCumulativeProfitReset);
                })
        );
    }

    for (auto &future : futures) {
        future.get();
    }
}

// Processes every quote of every day loaded in memory for the ticker specified. The quotes will be processed with the algorithm specified
// and its parent class (Algorithm). These two algorithms will use the parameter combinations passed as an argument (params).
void TickerBacktester::runSimulation(unordered_map<string, double> &params, vector<Result> &results, double &lowestCumulativeProfitReset) {
    unique_ptr<Algorithm> algo = getAlgo(params);
    Result result;
    double cumulativeCash = params["cash"];
    double dailyCashReset = params["cash"];
    double dailyCashNoReset = params["cash"];
    result.cumulativeProfitNoReset = 0;
    result.cumulativeProfitReset = 0;

    for (Day &day : days) {
        if (dailyCashNoReset < day.quotes.front().price) break;
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

// Returns a pointer to a new instance of the algorithm that matches the algoName passed as an argument to the backtester.
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
        switch(status) {
            case tooEarly:
                continue;
            case stopTrading:
                if (algo->activePositions) {
                    action = sell;
                }
                else {
                    action = doNothing;
                }
                break;
            case canTrade:
                if ((algo->activePositions && algo->tradeInBounds(dailyCashReset, quote, trade)) || !algo->activePositions) {
                    action = algo->processQuote(quote);
                    if ((action == buy && algo->activePositions) || (action == sell && !algo->activePositions)) {
                        action = doNothing;
                    }
                }
                else {
                      action = sell;
                }
                break;
            default:
                throw invalid_argument("received bad status");
        }

        if (action != doNothing) {
            handleAction(result, dailyCashReset, dailyCashNoReset, action, quote, trade, algo);
        }

        if (status == stopTrading) break;
    }
}

// Creates trades based on actions returned by an algorithm. This function will adjust cash levels as well based on the value of the trades.
void TickerBacktester::handleAction(Result &result, double &dailyCashReset, double &dailyCashNoReset, Action &action, Quote &quote, Trade &trade,
                                    unique_ptr<Algorithm> &algo) {
    trade.price = quote.price;
    trade.timestamp = quote.timestamp;
    trade.action = action;

    switch(action) {
        case buy: {
                algo->activePositions = true;
                // The purchasing power is the total amount of money that can be used to buy stocks depending on the margin and the maximum
                // loss per trade. The maxLossPerTrade is used to lower the total amount. This is useful in case of a loss and have a buffer
                // before getting a margin call.
                double purchasingPower = (dailyCashReset * (1 - algo->params["maxLossPerTrade"])) / algo->params["margin"];
                // If both the maxLossPerTrade and margin are high, the formula above will return a value lower than the dailyCash. If this
                // occurs, we must set the purchasing power back to the dailyCash value.
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
            break;
        case sell:
            algo->activePositions = false;
            dailyCashReset += trade.price * trade.quantityReset - COMMISSION;
            dailyCashNoReset += trade.price * trade.quantityNoReset - COMMISSION;
            result.trades.push_back(trade);
            trade.quantityReset = 0;
            trade.quantityNoReset = 0;
            break;
        default:
            throw invalid_argument("Invalid action");
    }
}

// Serializes all the results for a simulation in JSON format and sends them through stdout to the server for database upload.
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
    // The endl is very important here as it used by the parent process to separate de data of each simulation.
    cout << j_sim << endl;
}

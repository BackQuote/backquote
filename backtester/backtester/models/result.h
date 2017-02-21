#include "trade.h"

#ifndef BACKTESTER_RESULT_H
#define BACKTESTER_RESULT_H
struct Result {
    /*
    Daily profit vs cumulative profit: profit of that single day vs the profit of that single day + all the ones before it
    Reset vs NoReset: is the wallet value resetted to the same value after every day regardless of the gains or losses?
    */
    unordered_map<string, double> params;
    vector<Trade> trades;
    double dailyProfitReset;
    double cumulativeProfitReset;
    double dailyProfitNoReset;
    double cumulativeProfitNoReset;
};
#endif //BACKTESTER_RESULT_H


#include "quote.h"
#include "result.h"

using Result = result_ns::Result;

#ifndef BACKTESTER_DAY_H
#define BACKTESTER_DAY_H
struct Day {
    string date;
    vector<Quote> quotes;
    vector<Result> results;
};
#endif //BACKTESTER_DAY_H


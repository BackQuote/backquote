#include "quote.h"
#include "result.h"

#ifndef BACKTESTER_DAY_H
#define BACKTESTER_DAY_H
struct Day {
    string date;
    vector<Quote> quotes;
    vector<Result> results;
};
#endif //BACKTESTER_DAY_H


#include "quote.h"
#include "result.h"

using Result = result_ns::Result;

#ifndef BACKTESTER_DAY_H
#define BACKTESTER_DAY_H
struct Day {
    string date;
	// TODO: check if memory mapping the quotes file for that day would be more efficient that reading it and storing it in quotes vector
    vector<Quote> quotes;
    vector<Result> results;
};
#endif //BACKTESTER_DAY_H


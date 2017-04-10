#ifndef BACKTESTER_CONSTANTS_H
#define BACKTESTER_CONSTANTS_H

#include "../stdafx.h"

const int QUOTE_DIV_FACTOR = 10'000; // by how much we need to divide the quotes to represent them in dollars
const double COMMISSION = 5; // amount in dollars for selling a stock
const size_t LINE_ELEMENT_COUNT = 5; // 5 = number of elements we want in a line of an ultimate file (time, open, high, low, close)
const size_t MARKET_OPEN_TIME = 34'200'000; // milliseconds equivalent to 9h30
const size_t MARKET_CLOSE_TIME = 57'600'000; // milliseconds equivalent to 16h00
const std::string NEW_DAY_DELIMITER = ":";
const int DATE_LENGTH = 8;

#endif //BACKTESTER_CONSTANTS_H

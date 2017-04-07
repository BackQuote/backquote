//
// Created by Anthony on 2017-04-08.
//

#ifndef BACKTESTER_CONSTANTS_H
#define BACKTESTER_CONSTANTS_H

#include "../stdafx.h"

const int QUOTE_DIV_FACTOR = 10'000; // by how much we need to divide the quotes to represent them in dollars
const double COMMISSION = 5; // amount in dollars for selling a stock
const size_t LINE_ELEMENT_COUNT = 5; // 5 = number of elements we want in a line of an ultimate file (time, open, high, low, close)

#endif //BACKTESTER_CONSTANTS_H

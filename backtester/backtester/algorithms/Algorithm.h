#pragma once
#include "stdafx.h"
#include "../models/models.h"

class Algorithm {
public:
    std::unordered_map<std::string, double> params;
    bool activePositions;

    Algorithm();
    ~Algorithm();
    virtual Action processQuote(Quote &quote) = 0;
    Status checkStatus(double dailyCashReset, Quote &quote, trade_ns::Trade &trade, Day &day);
    bool tradeInBounds(double dailyCashReset, Quote &quote, trade_ns::Trade &trade);
};
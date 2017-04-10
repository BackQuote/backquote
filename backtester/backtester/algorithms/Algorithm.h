#pragma once
#include "stdafx.h"
#include "../models/models.h"

const size_t marketOpenTime = 34'200'000; // milliseconds equivalent to 9h30
const size_t marketCloseTime = 57'600'000; // milliseconds equivalent to 16h00

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
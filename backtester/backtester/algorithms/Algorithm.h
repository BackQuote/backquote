#pragma once
#include "stdafx.h"
#include "../models/models.h"

class Algorithm {
public:
	Algorithm();
	~Algorithm();
	virtual Action processQuote(Quote&) = 0;

protected:
	bool checkDayActive(size_t currentTime);
	std::unordered_map<std::string, double> algoParams;

private:
	const size_t marketOpenTime = 34'200'000; // milliseconds equivalent to 9h30
	const size_t marketCloseTime = 57'600'000; // milliseconds equivalent to 16h00
};
#pragma once
#include <string>
#include <unordered_map>
#include "../models/quote.h"
#include "../models/action.h"

using namespace std;

class Algorithm {
public:
	Algorithm();
	~Algorithm();
	virtual Action processQuote(Quote&) = 0;

protected:
	bool Algorithm::checkDayActive(size_t);
	unordered_map<string, double> algoParams;

private:
	const size_t marketOpenTime = 34'200'000; // milliseconds equivalent to 9h30
	const size_t marketCloseTime = 57'600'000; // milliseconds equivalent to 16h00
};
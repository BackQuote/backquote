#pragma once
#include <string>
#include <unordered_map>

using namespace std;

enum Action {
	buy = 0,
	sell = 1,
	nop = 2
};

class Algorithm {
public:
	virtual Action processQuote(double) = 0;
};
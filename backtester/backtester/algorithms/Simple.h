#pragma once
#include "Algorithm.h"

class Simple : public Algorithm {
public:
	Simple(const unordered_map<string, double> params);
	~Simple();
	Action processQuote(const double, const size_t);
	
private:
	bool bought;
};


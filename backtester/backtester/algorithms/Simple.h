#pragma once
#include "Algorithm.h"

class Simple : public Algorithm {
public:
	Simple(const unordered_map<string, double> params);
	~Simple();
	Action processQuote(Quote&);
	
private:
	bool bought;
};


#pragma once
#include "Algorithm.h"

class Simple : public Algorithm {
public:
	Simple();
	~Simple();
	Action processQuote(double);

private:
	size_t timeBufferStart, timeBufferEnd;
	bool bought;
};


#pragma once
#include "Algorithm.h"

class Simple : public Algorithm
{
public:
	Simple();
	~Simple();
	Position processQuote(double);
};


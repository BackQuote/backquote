#pragma once
#include "stdafx.h"
#include "models.h"

struct Day {
    std::string date;
	std::size_t closingTime;
	std::size_t openingTime;
	// TODO: check if memory mapping the quotes file for that day would be more efficient that reading it and storing it in quotes vector
    std::vector<Quote> quotes;
};

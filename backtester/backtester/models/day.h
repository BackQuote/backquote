#pragma once

#include "stdafx.h"
#include "models.h"

struct Day {
    std::string date;
	// TODO: check if memory mapping the quotes file for that day would be more efficient that reading it and storing it in quotes vector
    std::vector<Quote> quotes;
};

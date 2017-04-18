#pragma once
#include "stdafx.h"
#include "Algorithm.h"

class Simple : public Algorithm {
public:
    Simple(const std::unordered_map<std::string, double> &params);
    Simple();
    Action processQuote(Quote &quote);
};

#pragma once
#include "stdafx.h"
#include "models.h"

namespace result_ns {
	using namespace std;
	using json = nlohmann::json;
	using Trade = trade_ns::Trade;

	struct Result {
		/*
		Daily profit vs cumulative profit: profit of that single day vs the profit of that single day + all the ones before it
		Reset vs NoReset: is the wallet value resetted to the same value after every day regardless of the gains or losses?
		*/
		vector<Trade> trades;
		double dailyProfitReset;
		double cumulativeProfitReset;
		double dailyProfitNoReset;
		double cumulativeProfitNoReset;
	};

	void to_json(json& j, const Result& result);
}


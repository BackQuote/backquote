#include "trade.h"
#include "../external_dependencies/json.hpp"

using json = nlohmann::json;
using Trade = trade_ns::Trade;

#ifndef BACKTESTER_RESULT_H
#define BACKTESTER_RESULT_H
namespace result_ns {
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

	void to_json(json& j, const Result& result) {
		j = json{ { "trades", json(result.trades) }, { "dailyProfitReset", result.dailyProfitReset },
			{ "cumulativeProfitReset", result.cumulativeProfitReset }, { "dailyProfitNoReset", result.dailyProfitNoReset },
			{ "cumulativeProfitNoRest", result.cumulativeProfitNoReset } };
	}
}
#endif //BACKTESTER_RESULT_H

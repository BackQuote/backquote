#include "action.h"
#include "../external_dependencies/json.hpp"

using json = nlohmann::json;

#ifndef BACKTESTER_TRADE_H
#define BACKTESTER_TRADE_H
namespace trade_ns {
	struct Trade {
		double price;
		size_t quantityReset;
		size_t quantityNoReset;
		Action action;
		size_t timestamp;
	};

	void to_json(json& j, const Trade& trade) {
		string actionString;
		switch (trade.action) {
			case buy:
				actionString = "buy";
				break;
			case sell:
				actionString = "sell";
				break;
			case nop:
				actionString = "nop";
				break;
		}
		j = json{ { "price", trade.price }, { "quantityReset", trade.quantityReset }, { "quantityNoReset", trade.quantityNoReset },
			{ "action", actionString }, { "timestamp", trade.timestamp } };
	}
}
#endif //BACKTESTER_TRADE_H
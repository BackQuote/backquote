#include "stdafx.h"
#include "models.h"

using namespace std;
using json = nlohmann::json;
using Trade = trade_ns::Trade;

void trade_ns::to_json(json& j, const Trade& trade) {
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
	j = json{ { "price", trade.price },{ "quantityReset", trade.quantityReset },{ "quantityNoReset", trade.quantityNoReset },
	{ "action", actionString },{ "timestamp", trade.timestamp } };
}
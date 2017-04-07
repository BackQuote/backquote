#include "stdafx.h"
#include "Algorithm.h"

using Trade = trade_ns::Trade;
using namespace std;

Algorithm::Algorithm() {
}

Algorithm::~Algorithm() {
}

// Checks various conditions to determine if the backtester can trade, should stop trading or remain idle (tooEarly)
Status Algorithm::checkStatus(double dailyCashReset, Quote &quote, Trade &trade, Day &day) {
	if (quote.timestamp <= day.openingTime + (size_t)(params["timeBufferStart"])) {
		return tooEarly;
	}
	else if (quote.timestamp >= day.closingTime - (size_t)params["timeBufferEnd"]) {
		return stopTrading;
	}

	if (activePositions) {
		double profit = (trade.quantityReset * quote.price) - (trade.quantityReset * trade.price);
		double profitRate = profit / (dailyCashReset + (trade.quantityReset * trade.price));

		if (profitRate > params["maxDailyGain"] || profitRate < -params["maxDailyLoss"]) {
			return stopTrading;
		}
	}

	return canTrade;
}

// Checks if a trade is within the bounds established. In other words, is the trade profit below
// the maximum trade profit or the loss below the minimum loss?
bool Algorithm::tradeInBounds(double dailyCashReset, Quote &quote, Trade &trade) {
	double profit = (trade.quantityReset * quote.price) - (trade.quantityReset * trade.price);
	double profitRate = profit / (dailyCashReset + (trade.quantityReset * trade.price));

	if (profitRate > params["maxGainPerTrade"] || profitRate < (0 - params["maxLossPerTrade"])) {
		return false;
	}

	return true;
}

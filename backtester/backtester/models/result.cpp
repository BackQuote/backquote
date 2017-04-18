#include "stdafx.h"
#include "models.h"

using json = nlohmann::json;
using Result = result_ns::Result;

void result_ns::to_json(json& j, const Result& result) {
    j = json{ { "trades", json(result.trades) },{ "dailyProfitReset", result.dailyProfitReset },
    { "cumulativeProfitReset", result.cumulativeProfitReset },{ "dailyProfitNoReset", result.dailyProfitNoReset },
    { "cumulativeProfitNoReset", result.cumulativeProfitNoReset } };
}
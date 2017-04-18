#pragma once
#include "stdafx.h"
#include "models.h"

namespace trade_ns {
    using json = nlohmann::json;

    struct Trade {
        double price;
        size_t quantityReset;
        size_t quantityNoReset;
        Action action;
        size_t timestamp;
    };

    void to_json(json& j, const Trade& trade);
}

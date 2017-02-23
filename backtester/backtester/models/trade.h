#include "action.h"

#ifndef BACKTESTER_TRADE_H
#define BACKTESTER_TRADE_H
struct Trade {
    double price;
    size_t quantityReset;
    size_t quantityNoReset;
    Action action;
    size_t timestamp;
};
#endif //BACKTESTER_TRADE_H
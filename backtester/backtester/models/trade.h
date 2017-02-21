#include "action.h"

#ifndef BACKTESTER_ACTION_H
#define BACKTESTER_ACTION_H
struct Trade {
    double price;
    size_t quantityReset;
    size_t quantityNoReset;
    Action action;
    size_t timestamp;
};
#endif //BACKTESTER_ACTION_H
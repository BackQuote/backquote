#include "action.h"

struct Trade {
    double price;
    size_t quantityReset;
    size_t quantityNoReset;
    Action action;
    size_t timestamp;
};
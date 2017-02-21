#ifndef BACKTESTER_QUOTE_H
#define BACKTESTER_QUOTE_H
struct Quote {
    double price;
    size_t timestamp;
    bool lastOfTheDay = false;
};
#endif //BACKTESTER_QUOTE_H

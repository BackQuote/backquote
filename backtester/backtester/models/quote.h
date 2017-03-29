#pragma once

struct Quote {
    double price;
    size_t timestamp;
    bool lastOfTheDay = false;
};

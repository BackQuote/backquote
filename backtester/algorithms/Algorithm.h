#pragma once

enum Position {
	down = 0,
	none = 1,
	up = 2
};

enum Action {
	buy = 0,
	sell = 1
};

class Algorithm {
public:
	virtual Position processQuote(double) = 0;
};
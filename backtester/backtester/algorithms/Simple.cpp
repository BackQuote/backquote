#include "stdafx.h"
#include "Simple.h"

using namespace std;

Simple::Simple(const unordered_map<string, double> &params) : bought(false) {
	algoParams = params;
}

Action Simple::processQuote(Quote &quote) {
	if (!checkDayActive(quote.timestamp) || quote.lastOfTheDay) {
		if (bought) {
			bought = false;
			return sell;
		}
		return nop;
	}

	if (!bought) {
		bought = true;
		return buy;
	}
	return nop;
}

Simple::~Simple() {
}

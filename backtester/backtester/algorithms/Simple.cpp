#include "Simple.h"
#include <string>

Simple::Simple(const unordered_map<string, double> params) : bought(false) {
	algoParams = params;
}

Action Simple::processQuote(const double quote, const size_t timestamp) {
	if (!checkDayActive(timestamp)) {
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

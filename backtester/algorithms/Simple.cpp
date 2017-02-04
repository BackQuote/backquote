#include "Simple.h"
#include <string>

Simple::Simple() : bought(false) {
}

Action Simple::processQuote(double quote) {
	if (bought) {
		return nop;
	}
	bought = true;
	return buy;
}

Simple::~Simple() {
}

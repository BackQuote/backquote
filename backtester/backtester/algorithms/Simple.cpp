#include "Simple.h"

using namespace std;

Simple::Simple(const unordered_map<string, double> &params) {
	this->params = params;
}

Action Simple::processQuote(Quote &quote) {
	return buy;
}

Simple::Simple() {
}


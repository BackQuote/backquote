#include "Simple.h"

using namespace std;

Simple::Simple(const unordered_map<string, double> &params) {
	this->params = params;
	this->activePositions = false;
}

Action Simple::processQuote(Quote &quote) {
	return buy;
}

Simple::Simple() {
}


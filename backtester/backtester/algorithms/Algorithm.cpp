#include "Algorithm.h"

Algorithm::Algorithm() {
}

Algorithm::~Algorithm() {
}

bool Algorithm::checkDayActive(size_t currentTime) {
	if (currentTime > marketCloseTime - algoParams["timeBufferEnd"] || currentTime < marketOpenTime + algoParams["timeBufferStart"]) {
		return false;
	}
	return true;
}
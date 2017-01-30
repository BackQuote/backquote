#include "stdafx.h"
#include <string>
#include <iostream>
#include <fstream>
#include <cmath>
#include <vector>
#include <thread>
#include <map>
#include "external_dependencies/json.hpp"
#include "external_dependencies/ctpl_stl.h"
#include "algorithms/Simple.h"

using namespace std;
using json = nlohmann::json;

struct Trade {
	double price;
	double value;
	Action action;
	string time;
};

struct Result {
	map<string, double> params;
	vector<Trade> trades;
	double profit;
};

struct Day {
	string date;
	vector<double> quotes;
	vector<string> timestamps;
	vector<Result> results;
};

void split(const string&, string[]);
void addQuotes(const double, const double, const double, const double, unique_ptr<Day>&);
void loadUltimateFile(vector<Day>&, const string&);
void backtestAlgo(vector<Day>&, const json&, ctpl::thread_pool&, const string& algoName);
void throwException(const string& message);
void uploadResults(const vector<Day>&, const string&, const string&);
map<string, vector<string>> parseArgs(int, char*[]);
unique_ptr<Algorithm> getAlgo(const string&);

int main(int argc, char* argv[])
{
	map<string, vector<string>> args = parseArgs(argc, argv);
	const string algoName = args["--algoName"][0];
	vector<string> tickers = args["--tickers"];

	const int marketOpenTime = 34'200'000; // milliseconds equivalent to 9h30
	const int marketCloseTime = 57'600'000; // milliseconds equivalent to 16h00
	const string configFilePath = "algorithms/configs/" + algoName + ".json";
	
	ifstream i(configFilePath);
	json config;
	i >> config;

	/* One task per ticker will queued, and each one of those tasks will queue up several other tasks (max 8 total) and then
	block. 8 = 1 thread per core. When each thread per ticker blocks, we still want one thread per core to be active, so we
	have 8 + tickers.size threads in the pool. */
	ctpl::thread_pool tp(8 + tickers.size());
	vector<future<void>> results;
	for (const string &ticker : tickers)
	{
		results.push_back(
		tp.push([&](int id)
		{
			const string ultimateFile = "ultimate_files/" + ticker + ".txt";
			vector<Day> days;
			loadUltimateFile(days, ultimateFile);
			backtestAlgo(days, config, tp, algoName);
			uploadResults(days, ticker, algoName);
		}));
	}
	
	for (future<void> &result : results)
	{
		result.get();
	}
	cout << "Press any key to continue...\n";
	getchar();
	return 0;
}

map<string, vector<string>> parseArgs(int argc, char* argv[])
{
	map<string, vector<string>> args;
	args["--algoName"] = {};
	args["--tickers"] = {};

	for (int i = 1; i < argc - 1;)
	{
		if (args.find(argv[i]) == args.end())
			throw invalid_argument(string(argv[i]) + " is an unrecognized argument");

		int j = i + 1;
		for (; j < argc; ++j)
		{
			if (((string)argv[j]).find("--") != std::string::npos)
				break;
			args[argv[i]].push_back(argv[j]);
		}

		i = j;
	}

	return args;
}

void loadUltimateFile(vector<Day>& days, const string& ultimateFile)
{
	ifstream ultimateFileStream;
	ultimateFileStream.open(ultimateFile);
	if (!ultimateFileStream)
	{
		throwException("Couldn't open the ultimate file:" + ultimateFile);
	}
		
	string upLine;
	unique_ptr<Day> day = make_unique<Day>();
	getline(ultimateFileStream, upLine);
	day->date = upLine.substr(upLine.size() - 8, 8);

	while (getline(ultimateFileStream, upLine))
	{
		if (upLine.find("new day") != string::npos)
		{
			days.push_back(*day);
			day = make_unique<Day>();
			day->date = upLine.substr(upLine.size() - 8, 8);
		}
		else
		{
			string lineInfo[5]; //time, open, high, low, close
			split(upLine, lineInfo);
			
			string timestamp = lineInfo[0];
			day->timestamps.push_back(timestamp);
			
			double open, high, low, close;
			open = atof(lineInfo[1].c_str());
			high = atof(lineInfo[2].c_str());
			low = atof(lineInfo[3].c_str());
			close = atof(lineInfo[4].c_str());
			addQuotes(open, high, low, close, day);
		}
	}

	ultimateFileStream.close();
}

void split(const string& line, string lineInfo[])
{
	char* charLine = new char[line.size() + 1];
	const char* tempCharLine = line.c_str();
	strcpy_s(charLine, line.size() + 1, tempCharLine);
	char* nextToken = NULL;
	char* pch = strtok_s(charLine, ",", &nextToken);
	lineInfo[0] = pch; // time

	pch = strtok_s(NULL, ",", &nextToken);
	for (int i = 1; pch != NULL && i < 5; ++i) // 5 = number of values we want in a line (time, open, high, low, close)
	{
		lineInfo[i] = pch;
		pch = strtok_s(NULL, ",", &nextToken);
	}
	delete[] charLine;
}

void addQuotes(const double open, const double high, const double low, const double close, unique_ptr<Day>& day)
{
	day->quotes.push_back(open);
	double closeRatio = abs(close - low / close - high);
	double openRatio = abs(open - low / open - high);

	if (openRatio < closeRatio)
	{
		day->quotes.push_back(low);
		day->quotes.push_back(high);
	}
	else
	{
		day->quotes.push_back(high);
		day->quotes.push_back(low);
	}

	day->quotes.push_back(close);
}

void backtestAlgo(vector<Day>& days, const json& config, ctpl::thread_pool& tp, const string& algoName)
{
	
}

void uploadResults(const vector<Day>& days, const string& ticker, const string& algoName)
{
	//TODO: upload results to a database
}

unique_ptr<Algorithm> getAlgo(const string& algoName)
{
	if (algoName.compare("simple") == 0)
		return make_unique<Simple>(Simple());
	
	throwException("Algorithm with name " + algoName + " is not implemented.");
}

void throwException(const string& message)
{
	cout << message << endl;
	throw 20;
}
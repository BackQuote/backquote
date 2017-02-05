#include "stdafx.h"
#include <string>
#include <boost/filesystem.hpp>
#include <boost/foreach.hpp>
#include <iostream>
#include <fstream>
#include <sys/stat.h>
#include <sstream>
#include <map>
#include <stdexcept>
#include <vector>
#include <thread>

using namespace std;
namespace fs = boost::filesystem;

int main(int argc, char* argv[])
{
	void throwException(const string&);
	void generateFileForTicker(string&, string&);

	map<string, vector<string>> args;
	args["--quotesDir"] = {};
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

	if (args["--quotesDir"].empty())
		args["--quotesDir"].push_back("quotes");

	string quotesDir = args["--quotesDir"][0];
	vector<string> tickers = args["--tickers"];
	
	vector<unique_ptr<thread>> threads = {};
	for (int i = 0; i < tickers.size(); ++i)
		threads.push_back(make_unique<thread>(generateFileForTicker, tickers[i], quotesDir));

	for (int i = 0; i < threads.size(); ++i)
		threads[i]->join();

	return 0;
}

void generateFileForTicker(string& ticker, string& quotesDir)
{
	const int marketOpenTime = 34'200'000;
	const int marketCloseTime = 57'600'000;
	fs::path targetDir(quotesDir);
	fs::directory_iterator it(targetDir), eod;
	ifstream fileStream;
	ofstream ultimateFileStream;
	string line;
	string filePath;
	string ultimateFilePath = "../../../backtester/ultimate_files/" + ticker + "_ultimate.txt";
	struct stat buffer;
	int time;

	if (stat(ultimateFilePath.c_str(), &buffer) == 0)
		throwException(ultimateFilePath + " doesn't exist");
	ultimateFileStream.open(ultimateFilePath);
	if (!ultimateFileStream)
		throwException("couldn't open " + ultimateFilePath);

	BOOST_FOREACH(fs::path const &p, std::make_pair(it, eod))
	{
		const string dayFolderPath = p.generic_string();
		string dayDate = dayFolderPath.substr(dayFolderPath.size() - 8, 8);
		filePath = dayFolderPath + "/" + ticker + ".csv";
		fileStream.open(filePath);

		ultimateFileStream << "new day : " + dayDate << endl;
		if (fileStream)
		{
			while (getline(fileStream, line))
			{
				if (line.compare(""))
				{
					stringstream timeString(line.substr(0, 8));
					timeString >> time;
					if (time > marketOpenTime && time < marketCloseTime)
						ultimateFileStream << line << endl;
				}
			}
		}
		else
			throwException("couldn't open " + filePath);
		fileStream.close();
	}
	ultimateFileStream.close();
}

void throwException(const string& message)
{
	cout << message << endl;
	throw 20;
}
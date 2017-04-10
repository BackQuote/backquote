#include <iostream>
#include <sys/stat.h>
#include "stdafx.h"
#include "models/models.h"
#include "TickerBacktester.h"

using namespace std;
using json = nlohmann::json;
using Result = result_ns::Result;

string buildbacktesterRootDir(char* exeDir);
void parseArgs(int argc, char* argv[], unordered_map<string, vector<char*>> &args);
void buildParamCombos(json &config, vector<unordered_map<string, double>> &paramCombos);
void paramCombosRecursion(size_t i, vector<string> &rangeNames, vector<vector<double>> &ranges, unordered_map<string, double> &params,
                          vector<unordered_map<string, double>> &paramCombos);

int main(int argc, char* argv[]) {

    clock_t startTime = clock();
    double backtestDuration;

    const string backtesterRootDir = buildbacktesterRootDir(argv[0]);

    unordered_map<string, vector<char*>> args;
    parseArgs(argc, argv, args);
    const string algoName = args["--algoName"][0];
    vector<char*> tickers = args["--tickers"];

    json config;
    if (args["--params"].size() > 0) {
        config = json::parse(args["--params"][0]);
    }
    else {
        ifstream i(backtesterRootDir + "/algorithms/configs/" + algoName + ".json");
        i >> config;
    }

    vector<unordered_map<string, double>> paramCombos;
    buildParamCombos(config, paramCombos);
    const size_t totalSimulationCount = paramCombos.size() * tickers.size();
    cout << totalSimulationCount << endl; // communicating to the server how many simulations will run

    // One task per ticker will be queued, and each one of those tasks will queue up several other tasks (one per simulation). The number
    //  of active tasks is equal to the number of cores on your system, which is the number used to initialize the thread pool.
    ctpl::thread_pool tp(thread::hardware_concurrency() + tickers.size());
    vector<future<void>> taskReturns;
    mutex m;

    for (auto &ticker : tickers) {
        taskReturns.push_back(
                tp.push([&](int id) {
                    auto tb = TickerBacktester((string)ticker, ref(backtesterRootDir), ref(algoName));
                    tb.backtestAlgo(tp, paramCombos, m);
                })
        );
    }

    for (auto &tr : taskReturns) {
        tr.get();
    }

    backtestDuration = (clock() - startTime) / (double)CLOCKS_PER_SEC;
    cout << "Backtester done." << endl;
    cout << "Backtest duration: " << backtestDuration << endl;



    return 0;
}


// Example of the string this function returns on a Windows system: C:\projects\backquote\backtester\backtester
string buildbacktesterRootDir(char* exeDir) {
    string dir = exeDir;
    string backtestercpp;
    struct stat buffer;
    char c;

    size_t endPos;
    for (endPos = dir.length() - 1; stat(backtestercpp.c_str(), &buffer) != 0; --endPos) {
        c = dir.at(endPos);
        if (c == '/' || c == '\\') {
            backtestercpp = dir.substr(0, endPos + 1) + "backtester.cpp";
        }
    }

    return dir.substr(0, endPos+1);
}

// Fills the args unordered map with the arguments received in the main's argv with key=argName, value=argValue
void parseArgs(int argc, char* argv[], unordered_map<string, vector<char*>> &args) {
    args["--algoName"] = {};
    args["--tickers"] = {};
    args["--params"] = {};

    for (int i = 1; i < argc - 1;) {
        if (!args.count(argv[i])) {
            throw invalid_argument(string(argv[i]) + " is an unrecognized argument");
        }

        int j = i + 1;
        for (; j < argc; ++j) {
            if (((string)argv[j]).find("--") != string::npos) {
                break;
            }
            args[argv[i]].push_back(argv[j]);
        }

        i = j;
    }
}

// Finds all the parameter combinations possible with the given json config (params) and stores them in paramCombos.
void buildParamCombos(json &config, vector<unordered_map<string, double>> &paramCombos) {
    vector<string> rangeNames;
    vector<vector<double>> ranges;
    unordered_map<string, double> params;

    for (json::iterator it = config.begin(); it != config.end(); ++it) {
        try {
            vector<double> range = it.value().get<vector<double>>();
            ranges.push_back(range);
            rangeNames.push_back(it.key());
        }
        catch (domain_error) {
            params[it.key()] = it.value().get<double>();
        }
    }

    if (ranges.size() > 0) {
        paramCombosRecursion(0, rangeNames, ranges, params, paramCombos);
    }
    else {
        paramCombos.push_back(params);
    }
}

// Used in the buildParamCombos function to find recursively all the parameter combinations. Recursion is used because the number of
// parameters and ranges is variable depending on the config.
void paramCombosRecursion(size_t i, vector<string> &rangeNames, vector<vector<double>> &ranges, unordered_map<string, double> &params,
                          vector<unordered_map<string, double>> &paramCombos) {
    double start = ranges[i][0];
    double end = ranges[i][1];
    double increment = ranges[i][2];

    while (start <= end) {
        params[rangeNames[i]] = start;
        if (i == ranges.size() - 1) {
            paramCombos.push_back(params);
        }
        else {
            paramCombosRecursion(i + 1, rangeNames, ranges, params, paramCombos);
        }
        start += increment;
    }
}

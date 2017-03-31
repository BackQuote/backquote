# Backtester
The backtester is a performant multithreaded program meant to backtest large amounts of historical stock data with any algorithm.
It is meant to be independent from parameter configurations and algorithm implementation.
### How it works
1. Algorithm name and ticker symbols are passed as arguments on launch like this: --algoName simple --tickers upro spy <br/>
2. JSON config associated with the specified algorithm will be loaded from this location: ~\algorithms\configs\algoName.json <br/>
3. A thread pool is created and one thread per ticker is created. Each one of those threads will: load quotes data associated with the
matching ticker, launch several threads (one per parameter combination) to backtest the algorithm against the data and upload the results.
4. In the JSON config, it will look for parameters with ranges (in brackets). For example, "param1":[0,5,1] means the algorithm must be
backtested with all the values of this parameter between 0 and 5 (inclusive) with an increment of one. In this case, it may only
represent 6 runs, but if we add several other range parameters, the number of combinations to be backtested becomes large quickly.
5. Since the number of range parameters varies depending on the algorithm, all the combinations are determined recursively. For every
combination a new thread is started: a new instance of the specified algorithm's class is created. Then, all quotes data are sent to the
algorithm instance through the processQuote function.<br/>
6. Results and trades' info are stored in memory through the whole process and uploaded to a database at the very end (not yet implemented).

### In development:<br />
1. PostgreSQL client to pull quotes data and upload results<br/>
2. AI-based algorithms

## GenerateUltimateFile
When stock quotes are purchased, they are often split in many files (one per trading day).
This program parses all those files and combines them in one large file per ticker that will be used by the backtester. A clear separation
is made in those large files to easily associate quote data to a specific date.
Putting all the quotes in one file speeds up the time it takes to read all the quotes and load them into memory for every backtest.
The BOOST library is used to iterate through the file system.
It is optimized for performance: all ultimate files (one per ticker) get created simultaneously, potentially using multiples cores.

Example of the structure:<br />
rootfolder/
<br />--|&nbsp;  20150501/
<br />----|&nbsp;    aapl.csv
<br />------|&nbsp;      // TIME, OPEN, HIGH, LOW, CLOSE, VOLUME, SUSPICIOUS
<br />------|&nbsp;      38766000,1018500,1018500,1018500,1018500,300,0
<br />------|&nbsp;      ...
<br />----|&nbsp;    sp500.csv
<br />------|&nbsp;      ....
<br />----|&nbsp;    ...
<br />--|&nbsp;  20150502/
<br />----|&nbsp;    ...
<br />--|&nbsp;  ...
<br />  
### Upcoming:<br />
When parsing all the files for data, the data will be uploaded to a database instead of being written to large files.
This should improve the speed to acquire data by the backtester. This solution will be implemented once:<br/>
1. The database setup is complete.<br/>
2. The backtester's database client is complete.

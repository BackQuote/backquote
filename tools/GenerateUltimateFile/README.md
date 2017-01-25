# GenerateUltimateFile

When stock quotes are purchased, they are often split in many files (one per trading day).
This program writes all the quotes under one file and makes clear separations so that it's easy to know which quotes belong to what date.
Putting all the quotes in one file speeds up the time it takes to read all the quotes and load them into memory for every backtest.
The BOOST library is used to iterate through the file system.
It is optimized for performance: all ultimate files get created simultaneously, potentially using multiples cores.

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
  

#!/bin/bash
psql -U postgres -d backtester -a -f schema.sql
virtualenv ENV  
python upload_quotes.py >/dev/null

if [ "$(uname)" == "Darwin" ]; then
	# Mac OS X platform
    mv quotes ~/Library/Application\ Support/Postgres/var-9.6 && psql -U postgres -d backtester -a -f copy_quotes.sql
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
	# 64 bits Windows NT platform
    move quotes "C:\Program Files\PostgreSQL\9.6\data" && psql -U postgres -d backtester -a -f copy_quotes.sql
fi
psql -U postgres -d backtester -a -f seed.sql
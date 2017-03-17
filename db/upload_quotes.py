import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir + '/../server')
from models import Ticker, Day

ultimate_dir = current_dir + '/../backtester/backtester/ultimate_files'
engine = create_engine(os.environ['DATABASE_URL'], echo=True)
Session = sessionmaker(bind=engine)
session = Session()
quotes_file = open('quotes', 'w')

for ultimate in os.listdir(ultimate_dir):
    ticker_name = ultimate[:-4]
    ticker = Ticker(ticker_name)
    session.add(ticker)
    session.commit()

    ultimate_file = open(os.path.join(ultimate_dir, ultimate))
    day = None
    date = None

    for line in ultimate_file:
        if 'new day' in line:
            dinfo = line.split()
            date = dinfo[3]
            day = Day(date)
            session.add(day)
            session.commit()
        else:
            qinfo = line.split(',')
            # example format: 2011-05-16 15:36:38
            formatted_date = '-'.join((date[:4], date[4:6], date[6:])) + ' '
            hours = int(qinfo[0]) // 3600000
            minutes = (int(qinfo[0]) - hours * 3600000) // 60000
            seconds = (int(qinfo[0]) - hours * 3600000 - minutes * 60000) // 1000
            timestamp = formatted_date + ' ' + str(hours) + ':' + str(minutes) + ':' + str(seconds)

            open_price = qinfo[1][:-4] + '.' + qinfo[1][-4:-2]
            high_price = qinfo[2][:-4] + '.' + qinfo[2][-4:-2]
            low_price = qinfo[3][:-4] + '.' + qinfo[3][-4:-2]
            close_price = qinfo[4][:-4] + '.' + qinfo[4][-4:-2]

            quotes_file.write(
                '{}\t{}\t{}\t{}\t{}\t{}\t{}\n'
                    .format(open_price, high_price, low_price, close_price, timestamp, day.id, ticker_name)
            )

    ultimate_file.close()

quotes_file.close()
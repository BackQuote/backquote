from app import db
import json

###
# Utility functions
###
def decimal(decimal):
    return round(decimal, 2)


def serialize(list):
    return [item.serialize for item in list]

###
# Data Models
###
class Algorithm(db.Model):
    __tablename__ = "algorithm"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def __init__(self, name):
        self.name = name

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class Template(db.Model):
    __tablename__ = "template"

    id = db.Column(db.Integer, primary_key=True)
    params = db.Column(db.String)

    def __init__(self, params):
        self.params = params

    @property
    def serialize(self):
        return {
            'id': self.id,
            'params': json.loads(self.params)
        }


backtest_ticker = db.Table('backtest_ticker',
    db.Column('backtest_id', db.Integer, db.ForeignKey('backtest.id'), primary_key=True),
    db.Column('ticker', db.Integer, db.ForeignKey('ticker.ticker'), primary_key=True))


class Ticker(db.Model):
    __tablename__ = "ticker"

    ticker = db.Column(db.String, primary_key=True)

    def __init__(self, ticker):
        self.ticker = ticker

    @property
    def serialize(self):
        return {
            'ticker': self.ticker
        }


class Trade(db.Model):
    __tablename__ = "trade"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Numeric)
    quantity_reset = db.Column(db.Numeric)
    quantity_no_reset = db.Column(db.Numeric)
    action = db.Column(db.String)
    timestamp = db.Column(db.TIMESTAMP)
    result_id = db.Column(db.Integer, db.ForeignKey('result.id'))

    def __init__(self, price, quantity_reset, quantity_no_reset, action, timestamp, result_id):
        self.price = price
        self.quantity_reset = quantity_reset
        self.quantity_no_reset = quantity_no_reset
        self.action = action
        self.timestamp = timestamp
        self.result_id = result_id

    @property
    def serialize(self):
        return {
            'id': self.id,
            'price': decimal(self.price),
            'quantityReset': decimal(self.quantity_reset),
            'quantityNoReset': decimal(self.quantity_no_reset),
            'action': self.action,
            'timestamp': str(self.timestamp),
            'resultId': self.result_id
        }


class Quote(db.Model):
    __tablename__ = "quote"

    id = db.Column(db.Integer, primary_key=True)
    open = db.Column(db.Numeric)
    high = db.Column(db.Numeric)
    low = db.Column(db.Numeric)
    close = db.Column(db.Numeric)
    last_of_day = db.Column(db.Boolean)
    timestamp = db.Column(db.TIMESTAMP)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'))
    ticker = db.Column(db.String, db.ForeignKey('ticker.ticker'))

    def __init__(self, timestamp, open, high, low, close, last_of_day, day_id, ticker):
        self.open = open
        self.high = high
        self.low = low
        self.close = close
        self.last_of_day = last_of_day
        self.timestamp = timestamp
        self.day_id = day_id
        self.ticker = ticker

    @property
    def serialize(self):
        return {
            'id': self.id,
            'open': decimal(self.open),
            'close': decimal(self.close),
            'high': decimal(self.high),
            'low': decimal(self.low),
            'lastOfDay': self.last_of_day,
            'timestamp': str(self.timestamp),
            'dayId': self.day_id,
            'ticker': self.ticker
        }


class Result(db.Model):
    __tablename__ = "result"

    id = db.Column(db.Integer, primary_key=True)
    trades = db.relationship('Trade', backref='result')
    daily_profit_reset = db.Column(db.Numeric)
    daily_profit_no_reset = db.Column(db.Numeric)
    cumulative_profit_reset = db.Column(db.Numeric)
    cumulative_profit_no_reset = db.Column(db.Numeric)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'))
    simulation_id = db.Column(db.Integer, db.ForeignKey('simulation.id'))

    def __init__(self, daily_profit_reset, daily_profit_no_reset, cumulative_profit_reset,
                 cumulative_profit_no_reset, day_id, simulation_id):
        self.daily_profit_reset = daily_profit_reset
        self.daily_profit_no_reset = daily_profit_no_reset
        self.cumulative_profit_reset = cumulative_profit_reset
        self.cumulative_profit_no_reset = cumulative_profit_no_reset
        self.day_id = day_id
        self.simulation_id = simulation_id
        self.day = None

    @property
    def serialize(self):
        return {
            'id': self.id,
            'trades': serialize(self.trades),
            'dailyProfitReset': decimal(self.daily_profit_reset),
            'dailyProfitNoReset': decimal(self.daily_profit_no_reset),
            'cumulativeProfitReset': decimal(self.cumulative_profit_reset),
            'cumulativeProfitNoReset': decimal(self.cumulative_profit_no_reset),
            'dayId': self.day_id,
            'simulationId': self.simulation_id,
            'date': str(self.day.date)
        }


class Day(db.Model):
    __tablename__ = "day"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    quotes = db.relationship('Quote', backref='day')
    results = db.relationship('Result', backref='day')

    def __init__(self, date):
        self.date = date

    @property
    def serialize(self):
        return {
            'id': self.id,
            'date': str(self.date), # TODO: fix date
            'quotes': serialize(self.quotes),
            'results': serialize(self.results)
        }


class Simulation(db.Model):
    __tablename__ = "simulation"

    id = db.Column(db.Integer, primary_key=True)
    params = db.Column(db.String)
    profit_no_reset = db.Column(db.Numeric)
    profit_reset = db.Column(db.Numeric)
    results = db.relationship('Result', backref='simulation')
    backtest_id = db.Column(db.Integer, db.ForeignKey('backtest.id'))
    ticker = db.Column(db.String, db.ForeignKey('ticker.ticker'))

    def __init__(self, params, profit_no_reset, profit_reset, backtest_id, ticker):
        self.params = params
        self.profit_no_reset = profit_no_reset
        self.profit_reset = profit_reset
        self.backtest_id = backtest_id
        self.ticker = ticker

    @property
    def serialize(self):
        return {
            'id': self.id,
            'params': json.loads(self.params),
            'profitNoReset': str(self.profit_no_reset),
            'profitReset': str(self.profit_reset),
            'results': serialize(self.results),
            'backtestId': self.backtest_id,
            'ticker': self.ticker
        }


class Backtest(db.Model):
    __tablename__ = "backtest"

    id = db.Column(db.Integer, primary_key=True)
    params = db.Column(db.String)
    timestamp = db.Column(db.TIMESTAMP)
    success = db.Column(db.Boolean)
    simulations = db.relationship('Simulation', backref='backtest')
    algorithm_id = db.Column(db.Integer, db.ForeignKey('algorithm.id'))
    tickers = db.relationship('Ticker', secondary=backtest_ticker, backref='backtest')

    def __init__(self, params, timestamp, success, algorithm_id):
        self.params = params
        self.timestamp = timestamp
        self.success = success
        self.algorithm_id = algorithm_id

    @property
    def serialize(self):
        return {
            'id': self.id,
            'params': json.loads(self.params),
            'timestamp': str(self.timestamp),
            'success': self.success,
            'simulations': [i.serialize for i in self.simulations],
            'algorithmId': self.algorithm_id,
            'tickers': [i.serialize for i in self.tickers]
        }

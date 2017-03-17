from app import db

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
            'params': self.params # Todo: fix params parsing
        }


backtest_ticker = db.Table('backtest_ticker',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('backtestId', db.Integer, db.ForeignKey('backtest.id')),
    db.Column('tickerId', db.Integer, db.ForeignKey('ticker.ticker')))


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
    quantity_reset = db.Column(db.Numeric)
    quantity_no_reset = db.Column(db.Numeric)
    action = db.Column(db.Integer)
    timestamp = db.Column(db.TIMESTAMP)
    result_id = db.Column(db.Integer, db.ForeignKey('result.id'))

    def __init__(self, quantity_reset, quantity_no_reset, action, timestamp, result_id):
        self.quantity_reset = quantity_reset
        self.quantity_no_reset = quantity_no_reset
        self.action = action
        self.timestamp = timestamp
        self.result_id = result_id

    @property
    def serialize(self):
        return {
            'id': self.id,
            'quantityReset': decimal(self.quantity_reset),
            'quantityNoReset': decimal(self.quantity_no_reset),
            'action': self.action,
            'timestamp': self.timestamp,
            'resultId': self.result_id
        }


class Quote(db.Model):
    __tablename__ = "quote"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Numeric)
    last_of_day = db.Column(db.Boolean)
    timestamp = db.Column(db.TIMESTAMP)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'))
    ticker = db.Column(db.String, db.ForeignKey('ticker.ticker'))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'price': decimal(self.price),
            'lastOfDay': self.last_of_day,
            'timestamp': self.timestamp,
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
            'simulationId': self.simulation_id
        }


class Day(db.Model):
    __tablename__ = "day"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    quotes = db.relationship('Quote', backref='day')
    results = db.relationship('Result', backref='day')

    def __init__(self, date, quotes, results):
        self.date = date
        self.quotes = quotes
        self.results = results

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
            'params': self.params,
            'profitNoReset': self.profit_no_reset,
            'profitReset': self.profit_reset,
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

    def __init__(self, params, timestamp, success, algorithm_id, tickers):
        self.params = params
        self.timestamp = timestamp
        self.success = success
        self.algorithm_id = algorithm_id
        self.tickers = tickers

    @property
    def serialize(self):
        return {
            'id': self.id,
            'params': self.params,
            'timestamp': str(self.timestamp),
            'success': self.success,
            'simulations': serialize(self.simulations),
            'algorithmId': self.algorithm_id,
            'tickers': self.tickers
        }

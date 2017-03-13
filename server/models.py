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

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Template(db.Model):
    __tablename__ = "template"

    id = db.Column(db.Integer, primary_key=True)
    algorithm = db.Column(db.Integer)
    params = db.Column(db.String)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'algorithm': self.algorithm,
            'params': self.params # Todo: fix params parsing
        }

class Ticker(db.Model):
    __tablename__ = "ticker"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    code = db.Column(db.String)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code
        }

class Trade(db.Model):
    __tablename__ = "trade"

    id = db.Column(db.Integer, primary_key=True)
    quantity_reset = db.Column(db.Numeric)
    quantity_no_reset = db.Column(db.Numeric)
    action = db.Column(db.Integer)
    timestamp = db.Column(db.TIMESTAMP)
    result_id = db.Column(db.Integer, db.ForeignKey('result.id'))

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

    @property
    def serialize(self):
        return {
            'id': self.id,
            'price': decimal(self.price),
            'lastOfDay': self.last_of_day,
            'timestamp': self.timestamp,
            'dayId': self.day_id
        }

class Result(db.Model):
    __tablename__ = "result"

    id = db.Column(db.Integer, primary_key=True)
    params = db.Column(db.String)
    trades = db.relationship('Trade', backref='result')
    daily_profit_reset = db.Column(db.Numeric)
    daily_profit_no_reset = db.Column(db.Numeric)
    cumulative_profit_reset = db.Column(db.Numeric)
    cumulative_profit_no_reset = db.Column(db.Numeric)
    day_id = db.Column(db.Integer, db.ForeignKey('day.id'))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'params': self.params,
            'trades': serialize(self.trades),
            'dailyProfitReset' : decimal(self.daily_profit_reset),
            'dailyProfitNoReset' : decimal(self.daily_profit_no_reset),
            'cumulativeProfitReset' : decimal(self.cumulative_profit_reset),
            'cumulativeProfitNoReset' : decimal(self.cumulative_profit_no_reset),
            'dayId' : self.day_id
        }

class Day(db.Model):
    __tablename__ = "day"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date),
    quotes = db.relationship('Quote', backref='day')
    results = db.relationship('Result', backref='day')

    @property
    def serialize(self):
        return {
            'id': self.id,
            'date': str(self.date), # TODO: fix date
            'quotes': serialize(self.quotes),
            'results': serialize(self.results),
        }

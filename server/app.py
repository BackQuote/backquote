#!/usr/bin/env python
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

import os
import subprocess

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

from models import *

db = SQLAlchemy(app)

@app.route('/')
def api_root():
    return '<h1>BackQuote API</h1>'

@app.route('/algorithms')
def algorithms():
    algos = Algorithm.query.all()
    return jsonify([i.serialize for i in algos])

@app.route('/templates')
def templates():
    templates = Template.query.all()
    return jsonify([i.serialize for i in templates])

@app.route('/tickers')
def tickers():
    tickers = Ticker.query.all()
    return jsonify([i.serialize for i in tickers])

@app.route('/algorithms/<id>')
def algorithm(id):
    algorithm = Algorithm.query.get(id)
    return jsonify(algorithm.serialize)

@app.route('/results/<id>')
def result(id):
    result = Result.query.get(id)
    return jsonify(result.serialize)

@app.route('/days/<id>')
def day(id):
    day = Day.query.get(id)
    return jsonify(day.serialize)

@app.route('/trades/<id>')
def trade(id):
    trade = Trade.query.get(id)
    return jsonify(trade.serialize)

@app.route('/quotes/<id>')
def quote(id):
    quote = Quote.query.get(id)
    return jsonify(quote.serialize)

@app.route('/run_backtester')
def run_backtester(algorithm, params, tickers):
    exe = '../backtester/backtester/Release/backtester.exe'
    proc = subprocess.Popen([exe, '--algoName', algorithm, '--params', params, '--tickers'] + tickers,
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    line = ''
    while line != 'BACKTESTER DONE':
        line = proc.stdout.readline().rstrip('\r\n')
        print line

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])
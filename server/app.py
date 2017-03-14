#!/usr/bin/env python
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
<<<<<<< HEAD
from flask_socketio import SocketIO
from flask_cors import CORS
from Queue import Queue
from models import *
import os, json, subprocess
from time import sleep
=======
from flask_cors import CORS, cross_origin
from flask import request
from utils import fill_models

import os
import json
import subprocess
>>>>>>> updated models, started uploading

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)
socketio = SocketIO(app)

executing = False
backtest_queue = Queue()

### Routes
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

def execute_backtest():
    global executing, backtest_queue

    executing = True
    args = backtest_queue.get()

    exe = os.path.dirname(os.path.abspath(__file__)) + '/../backtester/backtester/Release/backtester.exe'
    proc = subprocess.Popen([exe, '--algoName', args['algorithm'], '--params', args['params'], '--tickers'] +
                            args['tickers'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    while 1:
        line = proc.stdout.readline().rstrip('\r\n')
        if line == 'BACKTESTER DONE':
            break
        simulation_results = json.loads(line)
<<<<<<< HEAD
        # TODO: convert simulation_results into DB models and upload them to the DB

    if not backtest_queue.empty():
        #starts the next enqueued backtest
        execute_backtest()
    executing = False


@app.route('/backtester/run', methods=['POST'])
def run_backtester():
    global executing, backtest_queue

    post_data = request.get_json()
    post_data['params'] = "".join(str(post_data['params']).split())

    backtest_queue.put(post_data)

    if executing is False:
        socketio.start_background_task(target=execute_backtest)

    return jsonify({"status": "ok"})
=======
        fill_models(simulation_results, backtest_id=1)
    return jsonify({'BACKTESTER RUN SUCCESSFUL': "TRUE"})
>>>>>>> updated models, started uploading

if __name__ == '__main__':
    socketio.run(app, debug=app.config['DEBUG'])
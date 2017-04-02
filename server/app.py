#!/usr/bin/env python
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from sqlalchemy.orm import lazyload
from flask_cors import CORS
from Queue import Queue
from upload import *
import os, json, subprocess

async_mode = None
thread = None
executions = []
completed_executions = []
pending_executions = []

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)
socketio = SocketIO(app, async_mode=async_mode)

executing = False
backtest_queue = Queue()

def jsonify_all(list):
    return jsonify([item.serialize for item in list])

### Routes
@app.route('/')
def api_root():
    return '<h1>BackQuote API</h1>'

@app.route('/algorithms')
def algorithms():
    algos = Algorithm.query.all()
    return jsonify_all(algos)

@app.route('/templates')
def templates():
    templates = Template.query.all()
    return jsonify_all(templates)

@app.route('/templates', methods=['POST'])
def save_template():
    post_data = request.get_json()
    template = upload_template(json.dumps(post_data['params']))
    return jsonify(template.serialize)

@app.route('/tickers')
def tickers():
    tickers = Ticker.query.all()
    return jsonify_all(tickers)

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

@app.route('/trades/results/<id>')
def trade_results(id):
    trades = Trade.query.filter_by(result_id = id).all()
    return jsonify_all(trades)

@app.route('/quotes/<day_id>/<ticker>')
def quote_by_day_ticker(day_id, ticker):
    quotes = Quote.query \
        .filter_by(day_id=day_id) \
        .filter_by(ticker=ticker) \
        .all()
    return jsonify_all(quotes)

@app.route('/quotes/<id>')
def quote(id):
    quote = Quote.query.get(id)
    return jsonify(quote.serialize)

@app.route('/simulations')
def simulations():
    simulations = Simulation.query.options(lazyload('results')).all()
    return jsonify_all(simulations)

@app.route('/simulations/<id>')
def simulation(id):
    simulation = Simulation.query.get(id)
    return jsonify(simulation.serialize)

@app.route('/simulations/<id>/results')
def simulations_results(id):
    results = Result.query.filter_by(simulation_id=id).all()
    for r in results:
        r.day = Day.query.get(r.day_id)
    return jsonify_all(results)

@app.route('/backtests')
def backtests():
    backtests = Backtest.query.options(lazyload('simulations')).all()
    for backtest in backtests:
        backtest.simulation_count = Simulation.query.filter_by(backtest_id=backtest.id).count()
    return jsonify_all(backtests)

@app.route('/backtests/<id>')
def backtest(id):
    backtest = Backtest.query.get(id)
    return jsonify(backtest.serialize)

@app.route('/backtests/<id>/simulations')
def backtests_simulations(id):
    simulations = Simulation.query.filter_by(backtest_id=id).all()
    return jsonify_all(simulations)

def emit_executions():
    global executions, completed_executions, pending_executions
    socketio.emit('executions', {'executions': json.dumps(completed_executions + executions + pending_executions)})

def execute_backtest():
    global executing, executions, completed_executions, pending_executions

    executing = True
    current_execution = pending_executions.pop(0)
    current_execution["pending"] = False
    executions.append(current_execution)

    backtest = Backtest.query.get(current_execution['id'])
    algorithm = Algorithm.query.get(backtest.algorithm_id)
    tickers = [i.ticker for i in backtest.tickers]

    exe = os.path.dirname(os.path.abspath(__file__)) + '/../backtester/backtester/backtester.exe'
    proc = subprocess.Popen([exe, '--algoName', algorithm.name, '--params', backtest.params, '--tickers'] +
                            tickers, stdin=subprocess.PIPE, stdout=subprocess.PIPE)

    simulation_count = 0
    number_of_simulations = proc.stdout.readline().rstrip('\r\n')
    current_execution["number_of_simulations"] = number_of_simulations
    emit_executions()

    while True:
        simulation_count += 1
        line = proc.stdout.readline().rstrip('\r\n')
        if line == 'Backtester done.':
            break
        simulation_results = json.loads(line)
        save_models(simulation_results, backtest.id)

        current_execution["current_simulation"] = simulation_count + 1
        current_execution["progress"] = float(simulation_count) / float(number_of_simulations) * 100
        emit_executions()

    completed_executions.append(executions.pop(0))

    execution_time = proc.stdout.readline().rstrip('\r\n').split()[-1]
    backtest_completed(backtest.id, execution_time)

    if pending_executions:
        # starts the next enqueued backtest
        execute_backtest()
    executing = False

@app.route('/backtester/run', methods=['POST'])
def run_backtester():
    global executing, executions, thread

    post_data = request.get_json()
    post_data['params'] = "".join(str(post_data['params']).split())

    backtest_id = save_backtest(post_data)
    pending_executions.append({
        "id": backtest_id,
        "progress": 0,
        "pending": True
    })

    emit_executions()
    if executing is False and thread is None:
        socketio.start_background_task(target=execute_backtest)

    return jsonify({"status": "ok"})

@app.route('/stats')
def stats():
    bestSimulation = Simulation.query.order_by(Simulation.profit_no_reset).first()
    numberOfBacktests = Backtest.query.count()
    numberOfSimulations = Simulation.query.count()
    return jsonify({
        "numberOfBacktests": numberOfBacktests,
        "numberOfSimulations": numberOfSimulations,
        "bestSimulation": bestSimulation.serialize
    })

@socketio.on('request_executions')
def get_latest_executions():
    emit_executions()

@socketio.on('clear_executions')
def clear_executions():
    global completed_executions
    del completed_executions[:]
    emit_executions()

if __name__ == '__main__':
    socketio.run(app, debug=app.config['DEBUG'])

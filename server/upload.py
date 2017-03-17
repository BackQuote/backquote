from models import *
from sqlalchemy import update
import time


def fill_models(simulation_results, backtest_id):
    params = simulation_results['params']
    results = simulation_results['results']
    profit_reset = simulation_results['profitReset']
    profit_no_reset = simulation_results['profitNoReset']
    ticker = simulation_results['ticker']

    # update backtest
    update(Backtest).where()(Backtest.id == backtest_id).values(success=True)

    # add simulation
    simulation = Simulation(params, profit_no_reset, profit_reset, backtest_id, ticker)
    db.session.add(simulation)
    db.session.commit()
    simulation_id = simulation.id

    # add results
    trade_models = []
    for day_result in results:
        day_id = Day.query(Day).filter(Day.date == day_result['date'])
        result = day_result['result']
        trades = result['trades']

        result_model = Result(result['dailyProfitReset'], result['dailyProfitNoReset'], result['cumulativeProfitReset'],
                              result['cumulativeProfitNoReset'], day_id, simulation_id)
        db.session.add(result_model)
        db.session.commit()

        # add trades
        result_id = result_model.id
        for trade in trades:
            trade_models.append(Trade(trade['quantityReset'], trade['quantityNoReset'], trade['action'],
                                      trade['timestamp'], result_id))

        db.session.add_all(trade_models)
        db.session.commit()


def save_backtest(args):
    backtest = Backtest(args['params'], time.time(), False, args['algorithmId'], args['tickers'])
    db.session.add(backtest)
    db.session.commit()
    return backtest.id
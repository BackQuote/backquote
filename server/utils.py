from models import *
from app import db


def fill_models(simulation_results, backtest_id):
    params = simulation_results['params']
    results = simulation_results['results']

    # add simulation
    simulation = Simulation(params, backtest_id)
    db.session.add(simulation)
    db.session.commit()
    simulation_id = simulation.id

    # add results
    trade_models = []
    for day_result in results:
        day_id = Day.query.get(day_result['date'])
        result = day_result['result']

        result_model = Result(result['daily_profit_reset'], result['daily_profit_no_reset'],
                              result['cumulative_profit_reset'], result['cumulative_profit_no_reset'],
                              day_id, simulation_id)
        db.session.add(result_model)
        db.session.commit()
        result_id = result_model.id
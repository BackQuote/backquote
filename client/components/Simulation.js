import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import SimulationChart from './SimulationChart';
import DailyResultChart from './DailyResultChart';

class Simulation extends React.Component {
  updateDailyResultChart(id) {
    this.props.updateDailyResultChart(id);
  }

  render() {
    let {days, dailyResult} = this.props;
    let {quotes, trades, profit} = dailyResult;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Simulation
          </h4>
        </header>
        <section>
          <div className="container">
            <SimulationChart days={days} updateDailyResultChart={() => {this.updateDailyResultChart();}}/>
            { Object.keys(dailyResult).length > 0 ?
              <DailyResultChart quotes={quotes} trades={trades} profit={profit} />
              : null
            }
          </div>
        </section>
      </div>
    );
  }
}

Simulation.propTypes = {
  days: PropTypes.array,
  dailyResult: PropTypes.object,
  updateDailyResultChart: PropTypes.func
};

export default Simulation;

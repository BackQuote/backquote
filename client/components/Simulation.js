import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import SimulationChart from './SimulationChart';
import DailyResultChart from './DailyResultChart';

class Simulation extends React.Component {
  updateDailyResultChart(id, dayId) {
    this.props.updateDailyResultChart(id, dayId, this.props.simulation.ticker);
  }

  render() {
    let {simulation, result, quotes, trades} = this.props;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Simulation
          </h4>
        </header>
        <section>
          <div className="container">
            <SimulationChart results={simulation.results || []} updateDailyResultChart={(id, dayId) => {this.updateDailyResultChart(id, dayId);}}/>
            { Object.keys(result).length > 0 ?
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
  simulation: PropTypes.object,
  result: PropTypes.object,
  quotes: PropTypes.array,
  trades: PropTypes.array,
  updateDailyResultChart: PropTypes.func
};

export default Simulation;

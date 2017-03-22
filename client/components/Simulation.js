import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import SimulationChart from './SimulationChart';
import DailyResultChart from './DailyResultChart';

class Simulation extends React.Component {
  updateDailyResultChart(id) {
    this.props.updateDailyResultChart(id);
  }

  render() {
    let {simulation} = this.props;
    console.log(simulation);
    //let {quotes, trades, profit} = dailyResult;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Simulation
          </h4>
        </header>
        <section>
          <div className="container">
            <SimulationChart days={[]} updateDailyResultChart={() => {this.updateDailyResultChart();}}/>
          </div>
        </section>
      </div>
    );
  }
}

Simulation.propTypes = {
  simulation: PropTypes.object,
  updateDailyResultChart: PropTypes.func
};

export default Simulation;

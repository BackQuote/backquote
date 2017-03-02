import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import SimulationChart from './SimulationChart';

class Simulation extends React.Component {
  goToDailyChart(id) {
    console.log(this.props);
    this.props.goToDailyChart(id);
  }

  render() {
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Simulation
          </h4>
        </header>
        <section>
          <div className="container">
            <SimulationChart days={this.props.days} goToDailyChart={() => {this.goToDailyChart();}}/>
          </div>
        </section>
      </div>
    );
  }
}

Simulation.propTypes = {
  days: PropTypes.array,
  goToDailyChart: PropTypes.func
};

export default Simulation;

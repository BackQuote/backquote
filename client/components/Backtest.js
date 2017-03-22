import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import SimulationRow from './SimulationRow';

class Backtest extends React.Component {
  render() {
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtest
          </h4>
        </header>
        <section>
          <table className="u-full-width">
            <thead>
            <tr>
              <th>Simulation</th>
              <th>Parameters</th>
              <th>Ticker</th>
              <th>Profit with reset</th>
              <th>Profit without reset</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.simulations.map((simulation, index) => {
                return <SimulationRow key={simulation.id} index={index + 1} simulation={simulation}/>;
              })
            }
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

Backtest.propTypes = {
  simulations: PropTypes.array
};

export default Backtest;

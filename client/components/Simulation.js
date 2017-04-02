import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import * as styles from '../styles/simulation.scss';
import SimulationChart from './SimulationChart';
import DailyResultChart from './DailyResultChart';

class Simulation extends React.Component {

  constructor() {
    super();
    this.state = {
      profitType: 'dailyProfitNoReset',
      selectedDay: {
        id: null,
        dayId: null
      }
    };
  }

  updateDailyResultChart(id, dayId) {
    this.setState({ selectedDay: {id, dayId} });
    this.props.updateDailyResultChart(id, dayId, this.props.simulation.ticker);
  }

  changeDailyResult(delta) {
    let id = this.state.selectedDay.id+delta;
    let dayId = this.state.selectedDay.dayId+delta;
    this.setState({ selectedDay: {id, dayId} });
    this.props.updateDailyResultChart(id, dayId, this.props.simulation.ticker);
  }

  previousDailyResult() {
    this.changeDailyResult(-1);
  }

  nextDailyResult() {
    this.changeDailyResult(+1);
  }

  setProfitType() {
    this.setState({profitType: this.refs.profitType.value});
  }

  render() {
    let {results, quotes, trades} = this.props;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Simulation
          </h4>
        </header>
        <section>
          <div className="container">
            <div className="u-pull-right">
              Profit{' '}
              <select name="profitType" ref="profitType" onChange={() => {this.setProfitType();}}>
                <option value="dailyProfitNoReset">Without Reset</option>
                <option value="dailyProfitReset">With Reset</option>
              </select>
            </div>
            <div className={styles.chart}>
              <SimulationChart results={results} profitType={this.state.profitType} updateDailyResultChart={(id, dayId) => {this.updateDailyResultChart(id, dayId);}}/>
            </div>
            { (quotes.length > 0 || trades.length > 0) ?
              <div className={styles.chart}>
                <DailyResultChart quotes={quotes} trades={trades} profitType={this.state.profitType}
                                  previousDailyResult={this.previousDailyResult.bind(this)}
                                  nextDailyResult={this.nextDailyResult.bind(this)}/>
              </div>
              : null }
          </div>
        </section>
      </div>
    );
  }
}

Simulation.propTypes = {
  simulation: PropTypes.object,
  quotes: PropTypes.array,
  trades: PropTypes.array,
  updateDailyResultChart: PropTypes.func
};

export default Simulation;

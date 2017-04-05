import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { card } from '../styles/card.scss';
import * as styles from '../styles/simulation.scss';
import SimulationChart from './SimulationChart';
import DailyResultChart from './DailyResultChart';
import ProfitNumber from './ProfitNumber';
import ProfitRate from './ProfitRate';
import JSONTree from 'react-json-tree';
import { theme } from '../themes/default';

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
    let {results, quotes, trades, simulation} = this.props;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            <Link to={'/backtests'}>Backtests</Link>
            {' '}<i className="fa fa-angle-right"> </i>{' '}
            <Link to={`/backtest/${simulation.backtestId}`}>Simulations</Link>
            {' '}<i className="fa fa-angle-right"> </i>{' '}
            <Link to={`/simulation/${simulation.id}`}>{simulation.id}</Link>
          </h4>
        </header>
        <section>
          <div className="container">

            { simulation ? (
              <div>
                <div className="row">
                  <div className="columns six">
                    <label>Returns summary</label>
                    <table>
                      <thead>
                      <tr>
                        <th></th>
                        <th>Value</th>
                        <th>Rate</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>No reset</td>
                        <td><ProfitNumber value={simulation.profitNoReset} /></td>
                        <td><ProfitRate value={simulation.profitRateNoReset}/></td>
                      </tr>
                      <tr>
                        <td>Reset</td>
                        <td><ProfitNumber value={simulation.profitReset} /></td>
                        <td><ProfitRate value={simulation.profitRateReset} /></td>
                      </tr>
                      <tr>
                        <td>No trading</td>
                        <td><ProfitNumber value={simulation.profitNoTrading} /></td>
                        <td><ProfitRate value={simulation.profitRateNoTrading} /></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="columns six">
                    <label>Parameters</label>
                    <JSONTree data={simulation.params || []} theme={theme} hideRoot />
                  </div>
                </div>
                <div className="row">
                  <div className="columns two">
                    <label>Ticker</label>
                    {simulation.ticker ? simulation.ticker.toUpperCase() : null}
                  </div>
                  <div className="columns two">
                    <label>Wallet needed</label>
                    {simulation.walletNeededForReset}$
                  </div>
                </div>
              </div>
            ) : null }
            <hr/>
            <div className="u-pull-right">
              Profit type{' '}
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

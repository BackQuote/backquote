import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import BacktestRow from './BacktestRow';

class BacktestList extends React.Component {
  render() {
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtests
          </h4>
        </header>
        <section>
          <table className="u-full-width">
            <thead>
            <tr>
              <th>Backtest</th>
              <th>Algorithm</th>
              <th>Parameters</th>
              <th>Tickers</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.backtests.map((backtest) => {
                return <BacktestRow key={backtest.id} backtest={backtest}/>;
              })
            }
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

BacktestList.propTypes = {
  backtests: PropTypes.array
};

export default BacktestList;

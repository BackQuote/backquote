import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

class BacktestRow extends React.Component {
  render() {
    return (
      <tr key={this.props.backtest.id}>
        <td>
          <Link to={`/backtest/${this.props.backtest.id}`}>{this.props.backtest.id}</Link>
        </td>
        <td>{this.props.backtest.algorithmId}</td>
        <td>
          <JSONTree data={JSON.parse(String(this.props.backtest.params))} hideRoot />
        </td>
        <td>
          {
            this.props.backtest.tickers.map((ticker) => {
              return ticker.ticker;
            })
          }
        </td>
      </tr>
    );
  }
}

BacktestRow.propTypes = {
  backtest: PropTypes.object
};

export default BacktestRow;

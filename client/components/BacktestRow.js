import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

const BacktestRow = ({backtest}) =>
  <tr key={backtest.id}>
    <td>
      <Link to={`/backtest/${backtest.id}`}>{backtest.id}</Link>
    </td>
    <td>Algorithm {backtest.algorithm}</td>
    <td>
      <JSONTree data={JSON.parse(String(backtest.params))} hideRoot />
    </td>
    <td>TODO: Ticker</td>
  </tr>;

BacktestRow.propTypes = {
  backtest: PropTypes.object
};

export default BacktestRow;

import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import { center, actions } from '../styles/tables.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import { theme } from '../themes/default';

const columns = [ {
  minWidth: 10,
  header: '#',
  accessor: 'id',
  render: row => <Link to={`/backtest/${row.value}`}>{row.value}</Link>,
  className: center
}, {
  minWidth: 30,
  header: 'Simulations',
  accessor: 'simulation_count',
  className: center
}, {
  minWidth: 30,
  header: 'Algorithm',
  accessor: 'algorithmId', // Todo: get the actual algorithm name
  className: center
}, {
  minWidth: 30,
  header: 'Tickers',
  accessor: 'tickers',
  render: row => <span>
    {row.value.map(ticker => {
      return ticker.ticker;
    }).join(', ')}
  </span>,
  className: center
}, {
  header: 'Parameters',
  accessor: 'params',
  render: row => <JSONTree data={row.value} theme={theme} hideRoot />
}, {
  minWidth: 60,
  header: 'Actions',
  accessor: 'id',
  className: [center, actions],
  render: row => <div className="content">
    <small>
      {JSON.stringify(row.row.executionTime)} sec
    </small>
    <Link className="button" to={`/backtest/${row.value}`}>view</Link>
  </div>
}];

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
          <ReactTable
            showPagination={false}
            minRows={0}
            data={this.props.backtests}
            columns={columns}
          />
        </section>
      </div>
    );
  }
}

BacktestList.propTypes = {
  backtests: PropTypes.array
};

export default BacktestList;

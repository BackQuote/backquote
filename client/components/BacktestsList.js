import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import { theme } from '../themes/default';

const columns = [ {
  minWidth: 50,
  header: 'Algorithm',
  accessor: 'algorithmId', // Todo: get the actual algorithm name
}, {
  header: 'Parameters',
  accessor: 'params',
  render: row => <JSONTree data={row.value} theme={theme} hideRoot />
}, {
  minWidth: 50,
  header: 'Tickers',
  accessor: 'tickers',
  render: row => <span>
    {row.value.map(ticker => {
      return ticker.ticker;
    }).join(', ')}
  </span>
}, {
  minWidth: 50,
  header: '',
  accessor: 'id',
  style: {textAlign: 'center'},
  render: row => <Link className="button" to={`/backtest/${row.value}`}>view</Link>
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
            columns={columns} />
        </section>
      </div>
    );
  }
}

BacktestList.propTypes = {
  backtests: PropTypes.array
};

export default BacktestList;

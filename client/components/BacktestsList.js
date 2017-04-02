import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import * as tableStyle from '../styles/tables.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import { theme } from '../themes/default';

class BacktestList extends React.Component {

  constructor() {
    super();
    this.columns = [ {
      minWidth: 10,
      header: '#',
      accessor: 'id',
      render: row => <span>
    <Link to={`/backtest/${row.value}`}>{row.value}</Link>
  </span>,
      className: tableStyle.center
    }, {
      minWidth: 30,
      header: 'Simulations',
      accessor: 'simulation_count',
      className: tableStyle.center
    }, {
      minWidth: 30,
      header: 'Algorithm',
      accessor: 'algorithm',
      className: tableStyle.center
    }, {
      minWidth: 30,
      header: 'Tickers',
      accessor: 'tickers',
      render: row => <span>
    {row.value.map(ticker => {
      return ticker.ticker;
    }).join(', ')}
  </span>,
      className: tableStyle.center
    }, {
      header: 'Parameters',
      accessor: 'params',
      render: row => <JSONTree data={row.value} theme={theme} shouldExpandNode={() => {return false;}} />
    }, {
      minWidth: 30,
      header: 'Status',
      accessor: 'status',
      className: [tableStyle.center, tableStyle.actions],
      render: row => row.row.success ? (<div>
        <i className="fa fa-check" style={{color: '#6CD899'}}> </i>{' '}
        {JSON.stringify(row.row.executionTime)} sec
      </div>) : <i className="fa fa-ellipsis-h"> </i>
    }, {
      minWidth: 50,
      header: 'Actions',
      accessor: 'id',
      className: [tableStyle.center, tableStyle.actions],
      render: row => <div>
        <a className={`button button-danger ${tableStyle.actionButton}`} onClick={() => {this.props.actions.deleteBacktest(row.value);}}>
          delete
        </a>{' '}
        <Link className={`button button-primary ${tableStyle.actionButton}`} to={`/backtest/${row.value}`}>
          view
        </Link>
      </div>
    }];
  }

  render() {
    let { backtests } = this.props;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtests
          </h4>
        </header>
        <section>
          <ReactTable
            minRows={0}
            showPagination
            defaultPageSize={100}
            className={tableStyle.reset}
            data={backtests}
            columns={this.columns}
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

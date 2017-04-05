import React, { PropTypes } from 'react';
import io from 'socket.io-client';
import { card } from '../styles/card.scss';
import * as tableStyle from '../styles/tables.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import { theme } from '../themes/default';
import Breadcrumbs from './Breadcrumbs';

class BacktestList extends React.Component {
  constructor() {
    super();
    this.state = {
      executions: []
    };
    this.socket = io('http://localhost:5000');
    this.columns = [ {
      minWidth: 15,
      header: '#',
      accessor: 'id',
      hideFilter: true,
      render: row => <span><Link to={`/backtest/${row.value}`}>{row.value}</Link></span>,
      className: tableStyle.center
    }, {
      minWidth: 30,
      header: 'Simulations',
      accessor: 'simulation_count',
      hideFilter: true,
      className: tableStyle.center,
      render: ({row}) => {
        let execution = this.getExecution(row.id);
        if (execution) {
          console.log(execution);
          return <div>{execution.number_of_simulations ? (
              (execution.current_simulation == execution.number_of_simulations) ? execution.number_of_simulations :
              (`${execution.current_simulation}/${execution.number_of_simulations}`)
            ) : 0}
          </div>;
        }

        return row.simulation_count;
      }
    }, {
      minWidth: 30,
      header: 'Algorithm',
      accessor: 'algorithm',
      className: tableStyle.center
    }, {
      minWidth: 30,
      header: 'Tickers',
      accessor: 'tickers',
      filterMethod: (filter, row) => {
        let result = row[filter.id].filter(ticker => {
          return ticker.ticker.startsWith(filter.value);
        });
        return result.length > 0;
      },
      render: row => <span>
        {row.value.map(ticker => {
          return ticker.ticker.toUpperCase();
        }).join(', ')}
      </span>,
      className: tableStyle.center
    }, {
      header: 'Parameters',
      accessor: 'params',
      filterMethod: (filter, row) =>
        (JSON.stringify(row[filter.id]).replace(/\"/g, '').includes(filter.value.replace(/\s*/g, ''))),
      sortable: false,
      render: row => <JSONTree data={row.value} theme={theme} shouldExpandNode={() => {return false;}} />
    }, {
      minWidth: 30,
      header: 'Status',
      accessor: 'executionTime',
      hideFilter: true,
      className: [tableStyle.center, tableStyle.actions],
      render: ({row}) => {
        let execution = this.getExecution(row.id);
        if (execution) {
          if (execution.pending) {
            return <i className="fa fa-ellipsis-h"> </i>;
          } else if (!execution.execution_time) {
            return <i className="fa fa-refresh fa-spin"> </i>;
          }
          return <div>
            <i className="fa fa-check" style={{color: '#6CD899'}}> </i>{' '}
            { execution.execution_time } sec
          </div>;
        }
        if (row.success) {
          return <div>
            <i className="fa fa-check" style={{color: '#6CD899'}}> </i>{' '}
            { JSON.stringify(row.executionTime) } sec
          </div>;
        }
        return <i className="fa fa-ellipsis-h"> </i>;
      }
    }, {
      minWidth: 50,
      header: 'Actions',
      accessor: 'id',
      hideFilter: true,
      sortable: false,
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

  componentDidMount() {
    this.socket.emit('request_executions');
    this.socket.on('executions', (data) => {
      this.setState({executions: JSON.parse(data.executions)});
    });
  }

  componentWillUnmount() {
    this.socket.removeAllListeners();
  }

  getExecution(id) {
    return this.state.executions.filter(exec => {
      return exec.id === id;
    })[0];
  }

  render() {
    let { backtests } = this.props;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            <Breadcrumbs crumbs={[
              ['Backtests', '/backtests'],
            ]}/>
          </h4>
        </header>
        <section>
          <ReactTable
            minRows={0}
            showPagination
            showFilters
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

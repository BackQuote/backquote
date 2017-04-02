import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import * as tableStyle from '../styles/tables.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import ProfitNumber from './ProfitNumber';
import { theme } from '../themes/default';

const columns = [ {
  minWidth: 50,
  header: 'Profit',
  accessor: 'profitNoReset',
  render: row => <ProfitNumber value={row.value}/>,
  className: tableStyle.center
}, {
  minWidth: 50,
  header: 'Profit (reset)',
  accessor: 'profitReset',
  render: row => <ProfitNumber value={row.value}/>,
  className: tableStyle.center
}, {
  minWidth: 30,
  header: 'Ticker',
  accessor: 'ticker',
  className: tableStyle.center
}, {
  header: 'Parameters',
  accessor: 'params',
  render: row => <JSONTree data={row.value} theme={theme} shouldExpandNode={() => {return false;}} />
}, {
  minWidth: 50,
  header: 'Actions',
  accessor: 'id',
  className: tableStyle.center,
  render: row => <Link className="button button-primary" to={`/simulation/${row.value}`}>view</Link>
}];

class Backtest extends React.Component {
  render() {
    let simulations = this.props.simulations;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtest
          </h4>
        </header>
        <section>
          <ReactTable
            minRows={0}
            showPagination
            defaultPageSize={100}
            className={tableStyle.reset}
            data={simulations}
            columns={columns} />
        </section>
      </div>
    );
  }
}

Backtest.propTypes = {
  simulations: PropTypes.array
};

export default Backtest;

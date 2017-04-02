import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import { center } from '../styles/tables.scss';
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
  className: center
}, {
  minWidth: 50,
  header: 'Profit (reset)',
  accessor: 'profitReset',
  render: row => <ProfitNumber value={row.value}/>,
  className: center
}, {
  minWidth: 30,
  header: 'Ticker',
  accessor: 'ticker',
  className: center
}, {
  header: 'Parameters',
  accessor: 'params',
  render: row => <JSONTree data={row.value} theme={theme} shouldExpandNode={() => {return false;}} />
}, {
  minWidth: 50,
  header: 'Actions',
  accessor: 'id',
  style: {textAlign: 'center'},
  render: row => <Link className="button button-primary" to={`/simulation/${row.value}`}>view</Link>
}];

class Backtest extends React.Component {
  render() {
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtest
          </h4>
        </header>
        <section>
          <ReactTable
            showPagination={false}
            minRows={0}
            data={this.props.simulations || []}
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

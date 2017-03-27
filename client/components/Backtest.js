import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import ReactTable from 'react-table';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import ProfitNumber from './ProfitNumber';
import { theme } from '../themes/default';

const columns = [{
  header: 'Parameters',
  accessor: 'params',
  render: row => <JSONTree data={row.value} theme={theme} hideRoot />
}, {
  minWidth: 50,
  header: 'Ticker',
  accessor: 'ticker'
}, {
  minWidth: 50,
  header: 'Profit',
  accessor: 'profitNoReset',
  render: row => <ProfitNumber value={row.value}/>
}, {
  minWidth: 50,
  header: 'Profit (reset)',
  accessor: 'profitReset',
  render: row => <ProfitNumber value={row.value}/>
}, {
  minWidth: 50,
  header: '',
  accessor: 'id',
  style: {textAlign: 'center'},
  render: row => <Link className="button" to={`/simulation/${row.value}`}>view</Link>
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

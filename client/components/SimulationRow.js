import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';
import ProfitNumber from './ProfitNumber';
import { theme } from '../themes/default';

class SimulationRow extends React.Component {
  render() {
    return (
      <tr key={this.props.simulation.id}>
        <td>
          <Link to={`/simulation/${this.props.simulation.id}`}>{this.props.index}</Link>
        </td>
        <td>
          <JSONTree data={this.props.simulation.params} theme={theme} hideRoot />
        </td>
        <td>{this.props.simulation.ticker}</td>
        <td><ProfitNumber value={this.props.simulation.profitReset}/></td>
        <td><ProfitNumber value={this.props.simulation.profitNoReset}/></td>
      </tr>
    );
  }
}

SimulationRow.propTypes = {
  simulation: PropTypes.object
};

export default SimulationRow;

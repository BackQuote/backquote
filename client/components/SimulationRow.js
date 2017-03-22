import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

class SimulationRow extends React.Component {
  render() {
    console.log(this.props.simulation);
    return (
      <tr key={this.props.simulation.id}>
        <td>
          <Link to={`/simulation/${this.props.simulation.id}`}>{this.props.index}</Link>
        </td>
        <td>
          <JSONTree data={JSON.parse(String(this.props.simulation.params))} hideRoot />
        </td>
        <td>{this.props.simulation.ticker}</td>
        <td>{this.props.simulation.profitReset}</td>
        <td>{this.props.simulation.profitNoReset}</td>
      </tr>
    );
  }
}

SimulationRow.propTypes = {
  simulation: PropTypes.object
};

export default SimulationRow;

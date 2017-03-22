import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

class SimulationRow extends React.Component {
  render() {
    return (
      <tr key={this.props.simulation.id}>
        <td>
          <Link to={`/simulation/${this.props.simulation.id}`}>{this.props.index}</Link>
        </td>
        <td>
          <JSONTree data={JSON.parse(String(this.props.simulation.params))} hideRoot />
        </td>
        <td>TODO: Ticker</td>
        <td>{this.props.simulation.profit}</td>
      </tr>
    );
  }
}

SimulationRow.propTypes = {
  simulation: PropTypes.object
};

export default SimulationRow;

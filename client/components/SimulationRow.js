import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

const SimulationRow = ({simulation}) =>
  <tr key={simulation.id}>
    <td>
      <Link to={`/simulation/${simulation.id}`}>{simulation.id}</Link>
    </td>
    <td>Algorithm {simulation.algorithm}</td>
    <td>
      <JSONTree data={JSON.parse(String(simulation.params))} hideRoot />
    </td>
    <td>TODO: Ticker</td>
  </tr>;

SimulationRow.propTypes = {
  simulation: PropTypes.object
};

export default SimulationRow;

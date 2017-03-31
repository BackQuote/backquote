import React, { PropTypes } from 'react';
import { Line } from 'rc-progress';
import { Link } from 'react-router';

export default class Execution extends React.Component {
  render() {
    let { execution } = this.props;
    return (
      <div>
        <Link to={`backtest/${execution.id}`}>Backtest #{execution.id}</Link>{' '}
        { execution.pending ? (
          <small>(pending...)</small>
        ) : execution.progress < 100  ? (
          <span>
            <small>({execution.current_simulation}/{execution.number_of_simulations})</small>{' '}
            <i className="fa fa-refresh fa-spin"> </i>
          </span>
        ) : <i className="fa fa-check" style={{color: '#6CD899'}}> </i> }
        <Line percent={execution.progress} strokeColor="#33c3f0" trailColor="#f6f6f6" />
      </div>
    );
  }
}
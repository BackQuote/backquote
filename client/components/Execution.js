import React, { PropTypes } from 'react';
import { Line } from 'rc-progress';
import { Link } from 'react-router';

export default class Execution extends React.Component {
  render() {
    let { execution } = this.props;
    return (
      <div>
        { execution.pending ? 'Pending...' :
          <Link to={`backtest/${execution.id}`}>Backtest #{execution.id}</Link>
        }
        <Line percent={execution.progress} strokeColor="#33c3f0" trailColor="#f6f6f6" />
      </div>
    );
  }
}
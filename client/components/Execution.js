import React, { PropTypes } from 'react';
import { Line } from 'rc-progress';
import { Link } from 'react-router';
import { remove } from '../styles/executions.scss';

export default class Execution extends React.Component {

  constructor() {
    super();
    this.state = {
      eta: null
    };
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.timer || nextProps.execution.eta !== this.props.execution.eta) {
      this.setState({eta: nextProps.execution.eta});
      this.startEtaTimer(nextProps.execution.eta);
    }
  }

  startEtaTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      if (this.state.eta -1 < 0) {
        clearInterval(this.timer);
        this.setState({eta: 0});
      } else {
        this.setState({eta: this.state.eta -1});
      }
    }, 1000);
  }

  humanReadableETA(remaining) {
    let minutes = parseInt(remaining / 60, 10);
    let seconds = parseInt(remaining % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}:${seconds}`;
  }

  render() {
    let { execution, actions } = this.props;
    return (
      <div>
        <Link to={`backtest/${execution.id}`}>Backtest #{execution.id}</Link>{' '}
        { execution.pending ? (
          <span>
            <small>(pending...)</small>{' '}
            <a href="javascript:void(0)" className={`${remove} fa fa-times`}
               onClick={() => {actions.deleteExecution(execution.id);}}> </a>
          </span>

        ) : execution.progress < 100  ? (
          <span>
            <i className="fa fa-refresh fa-spin"> </i>{' '}
            {execution.number_of_simulations ? (
                <small>({execution.current_simulation}/{execution.number_of_simulations})</small>
              ) : null}{' '}
            {this.state.eta ? (
              <small>{this.humanReadableETA(this.state.eta)}</small>
            ) : null }
          </span>
        ) : <i className="fa fa-check" style={{color: '#6CD899'}}> </i> }
        <Line percent={execution.progress} strokeWidth={1} strokeColor="#33c3f0" trailColor="#f6f6f6" />
      </div>
    );
  }
}
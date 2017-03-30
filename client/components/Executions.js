import React, { PropTypes } from 'react';
import io from 'socket.io-client';
import Execution from './Execution';
import { card } from '../styles/card.scss';

export default class Executions extends React.Component {
  constructor() {
    super();
    this.state = {
      executions: []
    };
    this.socket = io('http://localhost:5000');
  }

  componentDidMount() {
    this.socket.emit('request_executions');
    this.socket.on('executions', (data) => {
      this.setState({executions: JSON.parse(data.executions)});
    });
  }

  clearExecutions() {
    this.socket.emit('clear_executions');
  }

  render() {
    if (this.state.executions.length > 0) {
      return (
        <div className={card}>
          <header>
            <a className="u-pull-right" href="javascript:void(0)" onClick={() => {this.clearExecutions();}}>Clear</a>
            <h4 className="title">
              Executions
            </h4>
          </header>
          <section>
            {this.state.executions.map((execution, index) => {
              return <Execution key={index} execution={execution} />;
            })}
          </section>
        </div>
      );
    }

    return <div></div>;
  }
}
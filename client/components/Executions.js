import React, { PropTypes } from 'react';
import io from 'socket.io-client';
import Execution from './Execution';
import { card } from '../styles/card.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as backtestsActions from '../actions/backtests';

class Executions extends React.Component {
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
      console.log(data);
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
            <a className="u-pull-right" href="javascript:void(0)"
               onClick={() => {this.clearExecutions();}}>Clear</a>
            <h4 className="title">
              Executions
            </h4>
          </header>
          <section className="row">
            {this.state.executions.map((execution, index) => {
              let className = index % 2 === 0 ?  'no-margin-left' : '';
              return <div className={`columns six ${className}`} key={execution.id}>
                <Execution key={index} execution={execution} actions={this.props.actions} />
              </div>;
            })}
          </section>
        </div>
      );
    }

    return <div></div>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(backtestsActions, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(Executions);

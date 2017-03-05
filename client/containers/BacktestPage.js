import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Backtest from '../components/Backtest';
import * as simulationsActions from '../actions/simulations';

class BacktestPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSimulations();
  }

  render() {
    return (
      <Backtest simulations={this.props.simulations}/>
    );
  }
}

BacktestPage.propTypes = {
  simulations: PropTypes.array,
  actions: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    simulations: state.simulations
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(simulationsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BacktestPage);

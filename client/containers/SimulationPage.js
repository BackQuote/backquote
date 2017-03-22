import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import * as simulationAction from '../actions/simulation';
import * as quotesAction from '../actions/dailyResult';
import * as tradesAction from '../actions/dailyResult';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSimulation(this.props.params.id);
  }

  updateDailyResultChart(id, dayId, ticker) {
    this.props.actions.fetchDailyResult(id, dayId, ticker);
  }

  render() {
    let {simulation, quotes, trades} = this.props;
    return (
      <Simulation simulation={simulation} quotes={quotes} trades={trades}
                  updateDailyResultChart={(id, dayId, ticker) => {this.updateDailyResultChart(id, dayId, ticker);}}/>
    );
  }
}

SimulationPage.propTypes = {
  simulation: PropTypes.object,
  actions: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    simulation: state.simulation,
    quotes: state.quotes,
    trades: state.trades
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...simulationAction,
      ...quotesAction,
      ...tradesAction
    }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

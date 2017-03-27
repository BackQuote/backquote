import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import * as simulationAction from '../actions/simulation';
import * as quotesAction from '../actions/dailyResult';
import * as tradesAction from '../actions/dailyResult';

class SimulationPage extends React.Component {
  componentDidMount() {
    // TODO: we should not load that in here. already in the state from backtestPage
    this.props.actions.fetchSimulation(this.props.params.id);
    this.props.actions.fetchSimulationResults(this.props.params.id);
  }

  updateDailyResultChart(id, dayId, ticker) {
    this.props.actions.fetchDailyResult(id, dayId, ticker);
  }

  render() {
    let {simulation, simulationResults, quotes, trades} = this.props;
    return (
      <Simulation simulation={simulation} results={simulationResults} quotes={quotes} trades={trades}
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
    simulationResults: state.simulationResults,
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

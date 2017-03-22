import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import * as simulationAction from '../actions/simulation';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSimulation(this.props.params.id);
  }

  updateDailyResultChart(id) {
    this.props.actions.fetchDailyResult();
  }

  render() {
    let {simulation} = this.props;
    return (
      <Simulation simulation={simulation} updateDailyResultChart={() => {this.updateDailyResultChart();}}/>
    );
  }
}

SimulationPage.propTypes = {
  simulation: PropTypes.object,
  actions: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    simulation: state.simulation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...simulationAction,
    }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

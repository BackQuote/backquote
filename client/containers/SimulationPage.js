import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import * as daysActions from '../actions/days';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchDays();
  }

  goToDailyChart(id) {
    this.context.router.push(`/daily_result/${id}`);
  }

  render() {
    return (
      <Simulation days={this.props.days} goToDailyChart={() => {this.goToDailyChart();}}/>
    );
  }
}

SimulationPage.propTypes = {
  days: PropTypes.array,
  actions: PropTypes.object
};

SimulationPage.contextTypes = {
  router: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    days: state.days,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(daysActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

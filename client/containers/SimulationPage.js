import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import * as daysActionCreators from '../actions/days';
import * as dailyResultActionCreators from '../actions/dailyResult';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchDays();
  }

  updateDailyResultChart(id) {
    this.props.actions.fetchDailyResult();
  }

  render() {
    let {days, dailyResult} = this.props;
    return (
      <Simulation days={days} dailyResult={dailyResult} updateDailyResultChart={() => {this.updateDailyResultChart();}}/>
    );
  }
}

SimulationPage.propTypes = {
  days: PropTypes.array,
  dailyResult: PropTypes.object,
  actions: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    days: state.days,
    dailyResult: state.dailyResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...daysActionCreators,
      ...dailyResultActionCreators,
    }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

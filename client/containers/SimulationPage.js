import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import { fetchDays } from '../actions/days';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.fetchDays();
  }

  goToDailyChart(id) {
    this.props.history.push(`/daily_result/${id}`);
  }

  render() {
    return (
      <Simulation days={this.props.days} goToDailyChart={() => {this.goToDailyChart();}}/>
    );
  }
}

SimulationPage.propTypes = {
  days: PropTypes.array,
  fetchDays: PropTypes.func,
  history: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    days: state.days,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDays: () => dispatch(fetchDays())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

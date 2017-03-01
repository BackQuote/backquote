import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import { fetchDays } from '../actions/days';

const SimulationPage = () => {
  return (
    <Simulation/>
  );
};

SimulationPage.propTypes = {
  days: PropTypes.array,
  fetchDays: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    days: state.days,
  };
};

const mapDispatchToProps = () => {
  return {
    fetchDays: () => dispatch(fetchDays())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);

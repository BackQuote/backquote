import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';

const SimulationPage = () => {
  return (
    <Simulation/>
  );
};

SimulationPage.propTypes = {
  filter: PropTypes.string,
  onFilter: PropTypes.func
};

const mapStateToProps = (state) => {
  // TODO: map state to props
  return {
    filter: state.filter
  };
};

const mapDispatchToProps = () => {
  // TODO: map dispatch to props
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationPage);
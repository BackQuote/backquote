import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';

const ControlsPage = () => {
  return (
    <Controls/>
  );
};

ControlsPage.propTypes = {
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
)(ControlsPage);

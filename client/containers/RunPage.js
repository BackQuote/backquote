import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Run from '../components/Run';

const RunPage = () => {
  return (
    <Run/>
  );
};

RunPage.propTypes = {
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
)(RunPage);

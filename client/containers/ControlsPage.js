import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import { fetchAlgorithms } from '../actions/algorithms';

class ControlsPage extends React.Component {
  componentDidMount() {
    this.props.fetchAlgorithms();
  }

  render() {
    return (
      <Controls algorithms={this.props.algorithms}/>
    );
  }
}

ControlsPage.propTypes = {
  fetchAlgorithms: PropTypes.func,
  algorithms: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    algorithms: state.algorithms,
    hasErrored: state.algorithmsHasErrored,
    isLoading: state.algorithmsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAlgorithms: () => dispatch(fetchAlgorithms())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

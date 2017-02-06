import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import { fetchAlgorithms } from '../actions/algorithms';

class ControlsPage extends React.Component {
  componentDidMount() {
    // TODO: de-hardcode api endpoint
    this.props.fetchAlgorithms('http://localhost:8888/algorithms');
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
    fetchAlgorithms: (url) => dispatch(fetchAlgorithms(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

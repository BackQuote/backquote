import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Simulations from '../components/Simulations';
import { fetchSimulations } from '../actions/simulations';

class SimulationsPage extends React.Component {
  componentDidMount() {
    // TODO: de-hardcode api endpoint
    this.props.fetchSimulations('http://localhost:8888/simulations');
  }

  render() {
    return (
      <Simulations simulations={this.props.simulations}/>
    );
  }
}

SimulationsPage.propTypes = {
  fetchSimulations: PropTypes.func,
  simulations: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    simulations: state.simulations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSimulations: (url) => dispatch(fetchSimulations(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationsPage);

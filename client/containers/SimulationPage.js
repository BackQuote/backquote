import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Simulation from '../components/Simulation';
import { fetchDays } from '../actions/days';

class SimulationPage extends React.Component {
  componentDidMount() {
    this.props.fetchDays();
  }

  render() {
    return (
      <Simulation days={this.props.days}/>
    );
  }
}

SimulationPage.propTypes = {
  days: PropTypes.array,
  fetchDays: PropTypes.func,
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

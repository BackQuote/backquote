import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BacktestList from '../components/BacktestsList';
import { fetchBacktests } from '../actions/backtests';

class SimulationsPage extends React.Component {
  componentDidMount() {
    this.props.fetchBacktests();
  }

  render() {
    return (
      <BacktestList backtests={this.props.backtests}/>
    );
  }
}

SimulationsPage.propTypes = {
  fetchBacktests: PropTypes.func,
  backtests: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    backtests: state.backtests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBacktests: () => dispatch(fetchBacktests())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationsPage);

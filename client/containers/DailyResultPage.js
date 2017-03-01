import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DailyResult from '../components/DailyResult';
import { fetchDailyResult } from '../actions/dailyResult';

class DailyResultPage extends React.Component {
  componentDidMount() {
    fetchDailyResult();
  }

  render() {
    return (
      <DailyResult dailyResult={this.props.dailyResult} />
    );
  }
}

DailyResultPage.propTypes = {
  fetchDailyResult: PropTypes.func,
  dailyResult: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    dailyResult: state.dailyResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDailyResult: dispatch(fetchDailyResult())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyResultPage);

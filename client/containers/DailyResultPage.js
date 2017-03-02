import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DailyResult from '../components/DailyResult';
import * as dailyResultActions from '../actions/dailyResult';

class DailyResultPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchDailyResult();
  }

  render() {
    let { dailyResult } = this.props;
    return (
      <DailyResult dailyResult={dailyResult} />
    );
  }
}

DailyResultPage.propTypes = {
  actions: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    dailyResult: state.dailyResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(dailyResultActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyResultPage);

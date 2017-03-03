import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BacktestList from '../components/BacktestsList';
import * as backtestsActionCreators from '../actions/backtests';

class BacktestListPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchBacktests();
  }

  render() {
    return (
      <BacktestList backtests={this.props.backtests}/>
    );
  }
}

BacktestListPage.propTypes = {
  actions: PropTypes.object,
  backtests: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    backtests: state.backtests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(backtestsActionCreators, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BacktestListPage);

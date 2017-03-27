import React from 'react';
import Dashboard from '../components/Dashboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as statsAction from '../actions/stats';

class DashboardPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchStats();
  }

  render() {
    return (
      <Dashboard stats={this.props.stats}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stats: state.stats
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...statsAction}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);

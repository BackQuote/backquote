import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as backtestsActions from '../actions/backtests';
import * as algorithmsActions from '../actions/algorithms';
import * as templatesActions from '../actions/templates';
import * as tickersActions from '../actions/tickers';

class ControlsPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchAlgorithms();
    this.props.actions.fetchTickers();
    this.props.actions.fetchTemplates();
  }

  render() {
    let { actions, algorithms, templates, tickers } = this.props;
    return (
      <Controls actions={actions} algorithms={algorithms} templates={templates} tickers={tickers}/>
    );
  }
}

ControlsPage.propTypes = {
  actions: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    algorithms: state.algorithms,
    templates: state.templates,
    tickers: state.tickers
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...backtestsActions,
      ...algorithmsActions,
      ...templatesActions,
      ...tickersActions
    }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

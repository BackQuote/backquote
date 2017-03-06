import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as algorithmsActionCreators from '../actions/algorithms';
import * as templatesActionCreators from '../actions/templates';
import * as tickersActionCreators from '../actions/tickers';

class ControlsPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchAlgorithms();
    this.props.actions.fetchTickers();
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
    tickers: state.tickers,
    hasErrored: state.algorithmsHasErrored,
    isLoading: state.algorithmsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...algorithmsActionCreators,
      ...templatesActionCreators,
      ...tickersActionCreators
    }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

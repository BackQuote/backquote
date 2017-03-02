import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as algorithmsActionCreators from '../actions/algorithms';
import * as templatesActionCreators from '../actions/templates';

class ControlsPage extends React.Component {
  componentDidMount() {
    this.props.actions.fetchAlgorithms();
  }

  render() {
    let { actions, algorithms, templates } = this.props;
    return (
      <Controls actions={actions} algorithms={algorithms} templates={templates}/>
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
    hasErrored: state.algorithmsHasErrored,
    isLoading: state.algorithmsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...algorithmsActionCreators,
      ...templatesActionCreators
    }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

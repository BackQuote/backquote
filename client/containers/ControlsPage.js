import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import { fetchAlgorithms } from '../actions/algorithms';
import { fetchTemplates } from '../actions/templates';

class ControlsPage extends React.Component {
  componentDidMount() {
    this.props.fetchAlgorithms();
  }

  render() {
    return (
      <Controls algorithms={this.props.algorithms}
                templates={this.props.templates}
                fetchTemplates={this.props.fetchTemplates}/>
    );
  }
}

ControlsPage.propTypes = {
  fetchAlgorithms: PropTypes.func,
  fetchTemplates: PropTypes.func
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
    fetchAlgorithms: () => dispatch(fetchAlgorithms()),
    fetchTemplates: (algorithm) => dispatch(fetchTemplates(algorithm))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsPage);

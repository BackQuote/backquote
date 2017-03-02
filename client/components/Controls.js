import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import api from '../api';

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {parameters: ''};
  }

  componentDidMount() {
    this.handleAlgorithmChange();
  }

  handleAlgorithmChange() {
    this.props.fetchTemplates(this.refs.algorithm.value);
  }

  handleTemplateChange() {
    this.setState({parameters: this.refs.template.value});
  }

  handleParametersChange(event) {
    this.setState({parameters: event.target.value});
  }

  saveTemplate() {
    api.post('templates', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        algorithm: parseInt(this.refs.algorithm.value, 10),
        // TODO: validate json data before parsing
        params: JSON.parse(this.refs.template.value)
      })
    }) // TODO: show some confirmation in the UI
      .then(() => {
        this.setState({templateSaved: true});
      })
      .catch((error) => {
        this.setState({templateSaved: false, templateError: error});
      });
  }

  launchBacktest() {
    // TODO: unify saveTemplate and launchBacktest
    api.post('backtests', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        algorithm: parseInt(this.refs.algorithm.value, 10),
        // TODO: validate json data before parsing
        params: JSON.parse(this.refs.template.value)
      })
    }) // TODO: show some confirmation in the UI
      .then(() => {
        this.setState({templateSaved: true});
      })
      .catch((error) => {
        this.setState({templateSaved: false, templateError: error});
      });
  }

  render() {
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Backtest on historical data
          </h4>
          <p>
            Fill the fields below to proceed
          </p>
        </header>
        <section>
          <form>
            <div className="row">
              <div className="three columns">
                <label htmlFor="algorithm">Algorithm</label>
                <select className="u-full-width" id="algorithm" ref="algorithm"
                        onChange={() => {this.handleAlgorithmChange();}}>
                  {
                    this.props.algorithms.map((algorithm) => {
                      return <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>;
                    })
                  }
                </select>
              </div>
              <div className="three columns">
                <label htmlFor="algorithm">Template</label>
                <select className="u-full-width" id="templates" ref="template"
                        onChange={() => {this.handleTemplateChange();}}>
                  <option value="">Select</option>
                  {
                    this.props.templates.map((templates) => {
                      return <option key={templates.id} value={JSON.stringify(templates.params)}>{JSON.stringify(templates.params)}</option>;
                    })
                  }
                </select>
              </div>
              <div className="six columns">
                <div className="row">
                  <label htmlFor="parameters">Parameters </label>
                  <textarea value={this.state.parameters} onChange={(event) => {this.handleParametersChange(event);}}
                            className="u-full-width"
                            placeholder="{ ... }"
                            id="parameters">
                  </textarea>
                  <a href="javascript:void(0)" className="button u-pull-right"
                     onClick={() => {this.saveTemplate();}}>Save template
                  </a>
                </div>
              </div>
            </div>
          </form>
          <div className="row">
            <a href="javascript:void(0)" className="button button-primary u-pull-right"
               onClick={() => {this.launchBacktest();}}>Execute
            </a>
          </div>
        </section>
      </div>
    );
  }
}

Controls.propTypes = {
  fetchTemplates: PropTypes.func
};

export default Controls;

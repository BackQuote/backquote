import React, { PropTypes } from 'react';
import AceEditor from 'react-ace';
import EditorErrors from './EditorErrors';
import { card } from '../styles/card.scss';
import api from '../api';

import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parameters: '',
      syntaxErrors: [],
      editorOptions: {
        tabSize: 2,
        showGutter: true,
        showPrintMargin: false,
        highlightActiveLine: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true
      }
    };
  }

  componentDidMount() {
    this.handleAlgorithmChange();
  }

  handleAlgorithmChange() {
    this.props.actions.fetchTemplates(this.refs.algorithm.value);
  }

  handleTemplateChange() {
    this.setState({
      parameters: JSON.stringify(
        JSON.parse(this.refs.template.value), null, '\t'
      )
    });
  }

  handleParametersChange(event) {
    this.setState({parameters: event});
  }

  checkForErrors() {
    let errors = this.refs.editor.editor.getSession().getAnnotations();
    this.setState({syntaxErrors: errors});
    return errors.length > 0;
  }

  saveTemplate() {
    if (this.checkForErrors()) return;
    api.post('templates', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        algorithm: parseInt(this.refs.algorithm.value, 10),
        params: JSON.parse(this.state.parameters)
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
    if (this.checkForErrors()) return;
    api.post('backtester/run', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        algorithm: this.refs.algorithm.value,
        params: this.state.parameters,
        tickers: [this.refs.ticker.value]
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
              <div className="two columns">
                <label htmlFor="algorithm">Algorithm</label>
                <select className="u-full-width" id="algorithm" ref="algorithm"
                        onChange={() => {this.handleAlgorithmChange();}}>
                  {
                    this.props.algorithms.map((algorithm) => {
                      return <option key={algorithm.id} value={algorithm.name}>{algorithm.name}</option>;
                    })
                  }
                </select>
              </div>
              <div className="two columns">
                <label htmlFor="algorithm">Ticker</label>
                <select className="u-full-width" id="ticker" ref="ticker">
                  <option value="">Select</option>
                  {
                    this.props.tickers.map((ticker) => {
                      return <option key={ticker.id} value={ticker.code}>{ticker.name}</option>;
                    })
                  }
                </select>
              </div>
              <div className="two columns">
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
                  <div>
                    <AceEditor
                      mode="json"
                      theme="monokai"
                      ref="editor"
                      name="editor"
                      height="300px"
                      width="100%"
                      setOptions={this.state.editorOptions}
                      value={this.state.parameters}
                      onChange={(event) => {this.handleParametersChange(event);}}
                    />
                    <a href="javascript:void(0)" className="button u-pull-right"
                       style={{position: 'relative', bottom: '41px', right: '2px'}}
                       onClick={() => {this.saveTemplate();}}>Save
                    </a>
                    <EditorErrors errors={this.state.syntaxErrors} />
                  </div>
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

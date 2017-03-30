import React, { PropTypes } from 'react';
import AceEditor from 'react-ace';
import EditorErrors from './EditorErrors';
import Executions from './Executions';
import { card } from '../styles/card.scss';
import * as styles from '../styles/controls.scss';
import Select from 'react-select';

import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

const defaultParameters = {
  'timeBufferStart': [0, 0, 1],
  'timeBufferEnd': [0, 0, 1],
  'cash': 15000,
  'margin': 0.3,
  'maxLossPerTrade': 0.05,
  'maxDailyLoss': 0.3
};

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tickers: [],
      parameters: JSON.stringify(defaultParameters, null, '\t'),
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

  componentWillReceiveProps(nextProps) {
    if (this.props.tickers.length === 0 && nextProps.tickers.length > 0) {
      this.setState({tickers: [nextProps.tickers[0].ticker]});
    }
  }

  handleTemplateChange() {
    this.setState({
      parameters: JSON.stringify(
        JSON.parse(this.refs.template.value), null, '\t'
      )
    });
  }

  handleTickersChange(options) {
    this.setState({ tickers: options.map(option => {return option.value;})});
  }

  handleParametersChange(event) {
    this.setState({parameters: event});
  }

  checkForErrors() {
    let errors = this.refs.editor.editor.getSession().getAnnotations();
    this.setState({syntaxErrors: errors});
    return errors.length > 0 || this.state.tickers.length === 0;
  }

  saveTemplate() {
    if (this.checkForErrors()) return;
    this.props.actions.saveTemplate(
      parseInt(this.refs.algorithm.value, 10),
      JSON.parse(this.state.parameters || '{}')
    );
  }

  launchBacktest() {
    if (this.checkForErrors()) {
      alert('Please fill all fields');
      return;
    }
    let algorithm = JSON.parse(this.refs.algorithm.value);
    this.props.actions.launchBacktest(
      algorithm.name,
      algorithm.id,
      this.state.parameters,
      this.state.tickers
    );
  }

  render() {
    let { algorithms, templates, tickers } = this.props;
    return (
      <div>
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
                <div className="four columns">
                  <label htmlFor="algorithm">Algorithm</label>
                  <select className="u-full-width" id="algorithm" ref="algorithm"
                          onChange={() => {this.handleAlgorithmChange();}}>
                    {
                      algorithms.map(algorithm => {
                        return <option key={algorithm.id} value={[JSON.stringify(algorithm)]}>{algorithm.name}</option>;
                      })
                    }
                  </select>
                </div>
                <div className="four columns">
                  <label htmlFor="algorithm">Tickers</label>
                  <Select
                    multi
                    value={this.state.tickers}
                    onChange={this.handleTickersChange.bind(this)}
                    options={tickers.map(ticker => {return {value: ticker.ticker, label: ticker.ticker};})}
                  />
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <label htmlFor="parameters">Parameters </label>
                  <div>

                    <div className={styles.actionBar}>
                      <i className={`fa fa-code ${styles.editorIcon}`} aria-hidden="true"> </i>
                      <select className={`u-full-width ${styles.template}`} id="templates" ref="template"
                              onChange={() => {this.handleTemplateChange();}}>
                        <option value="{}">Load template</option>
                        {
                          templates.map(template => {
                            return <option key={template.id} value={JSON.stringify(template.params)}>{JSON.stringify(template.params)}</option>;
                          })
                        }
                      </select>
                      <a href="javascript:void(0)" className={`${styles.saveTemplate}`}
                         style={{position: 'relative', bottom: '41px', right: '2px'}}
                         onClick={() => {this.saveTemplate();}}>Save template
                      </a>
                    </div>
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
                  </div>
                  <EditorErrors errors={this.state.syntaxErrors} />
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
        <Executions/>
      </div>
    );
  }
}

Controls.propTypes = {
  actions: PropTypes.object,
  algorithms: PropTypes.array,
  tickers: PropTypes.array,
  templates: PropTypes.array
};

export default Controls;

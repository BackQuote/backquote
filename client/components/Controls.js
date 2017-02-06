import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';

class Controls extends React.Component {
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
                <select className="u-full-width" id="algorithm">
                  {
                    this.props.algorithms.map((algorithm) => {
                      return <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>;
                    })
                  }
                </select>
              </div>
              <div className="nine columns">
                <div className="row">
                  <label htmlFor="parameters">Parameters</label>
                  <textarea
                    className="u-full-width"
                    placeholder="{ ... }"
                    id="parameters">
              </textarea>
                </div>
              </div>
            </div>
          </form>
          <div className="row">
            <input className="button-primary u-pull-right"
                   type="submit" value="Execute" />
          </div>
        </section>
      </div>
    );
  }
}

Controls.propTypes = {
  algorithms: PropTypes.array
};

export default Controls;

import React from 'react';
import { card } from '../styles/card.scss';

const Controls = () =>
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
              <option value="algo1">Algorithm 1</option>
              <option value="algo2">Algorithm 2</option>
              <option value="algo3">Algorithm 3</option>
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
  </div>;

export default Controls;

import React from 'react';
import { card } from '../styles/card.scss';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

const Simulations = () =>
  <div className={card}>
    <header>
      <h4 className="title">
        Runs - Simulation 1
      </h4>
    </header>
    <section>
      <table className="u-full-width">
        <thead>
        <tr>
          <th>Run</th>
          <th>Algorithm</th>
          <th>Parameters</th>
          <th>Ticker</th>
          <th>Profit</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <Link to="/run/1">1</Link>
          </td>
          <td>Algorithm 1</td>
          <td>
            <JSONTree data={{data: 'value'}} hideRoot />
          </td>
          <td>S&P 500</td>
          <td>+500$</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>;

export default Simulations;

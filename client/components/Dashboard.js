import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import { Link } from 'react-router';
import ProfitNumber from './ProfitNumber';

class Dashboard extends React.Component {
  render() {
    let { stats } = this.props;

    if (Object.keys(stats).length > 0) {
      return (
        <div>
          <div className="row">
            <div className="12 columns">
              <div className={card}>
                <header>
                  <h4 className="title">
                    <Link to={`/simulation/${stats.bestSimulation.id}`}>Best simulation</Link>
                  </h4>
                </header>
                <section>
                  <ul>
                    <li>
                      Profit: {<ProfitNumber value={stats.bestSimulation.profitNoReset} />}
                    </li>
                    <li>
                      Profit (reset): {<ProfitNumber value={stats.bestSimulation.profitReset} />}
                    </li>
                  </ul>
                </section>
                <header>
                  <h4 className="title">
                    {stats.numberOfBacktests}{' '}<Link to={'/backtests'}>Backtests</Link>
                  </h4>
                </header>
                <section> </section>
                <header>
                  <h4 className="title">
                    {stats.numberOfSimulations}{' '}<Link to={'/backtests'}>Simulations</Link>
                  </h4>
                </header>
                <section> </section>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>Please execute at least one backtest to get stats.</div>;
  }
}

export default Dashboard;

import React, { PropTypes } from 'react';
import { card } from '../styles/card.scss';
import DailyResultChart from './DailyResultChart';

class DailyResult extends React.Component {
  render() {
    let {quotes, trades, profit} = this.props.dailyResult;
    return (
      <div className={card}>
        <header>
          <h4 className="title">
            Daily Result
          </h4>
        </header>
        <section>
          <div className="container">
            <DailyResultChart quotes={quotes} trades={trades} profit={profit} />
          </div>
        </section>
      </div>
    );
  }
}

DailyResult.propTypes = {
  dailyResult: PropTypes.object,
};
export default DailyResult;

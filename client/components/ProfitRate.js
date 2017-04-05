import React, { PropTypes } from 'react';
import { positive, negative } from '../styles/profitNumber.scss';

class ProfitRate extends React.Component {
  render() {
    let { value } = this.props;
    let rate = value * 100;
    return value < 0 ? (
      <span className={negative}>({rate}%)</span>
    ) : (
      <span className={positive}>{rate}%</span>
    );
  }
}

export default ProfitRate;

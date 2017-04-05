import React, { PropTypes } from 'react';
import { positive, negative } from '../styles/profitNumber.scss';

class ProfitRate extends React.Component {
  render() {
    let { value } = this.props;
    let rate = value * 100;
    let className = value < 0 ? negative : positive;
    return <span className={className}>{rate}%</span>;
  }
}

export default ProfitRate;

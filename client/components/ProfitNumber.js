import React, { PropTypes } from 'react';
import { positive, negative } from '../styles/profitNumber.scss';

class ProfitNumber extends React.Component {
  render() {
    let { value } = this.props;
    let className = value < 0 ? negative : positive;
    return (
      <span className={className}>{value}</span>
    );
  }
}

ProfitNumber.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default ProfitNumber;

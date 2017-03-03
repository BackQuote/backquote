import React, { PropTypes } from 'react';

const SyntaxError = ({error}) =>
  <span style={{display: 'block'}}>
    SyntaxError: {error.text} ({error.row + 1}:{error.column + 1})
  </span>;


SyntaxError.propTypes = {
  error: PropTypes.object
};

export default SyntaxError;

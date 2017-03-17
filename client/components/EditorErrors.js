import React, { PropTypes } from 'react';
import SyntaxError from './SyntaxError';

class EditorErrors extends React.Component {
  render() {
    let { errors } = this.props;
    return (
      <div>
        {errors.length > 0 ? (
          <pre>
            <small>
              Errors in parameters. Please correct them before saving a template or executing a Backtest.
            </small>
            <code style={{color: 'red', margin: 0}}>
            { errors.map((error, index) => {
              return <SyntaxError key={index} error={error} />;
            }) }
            </code>
          </pre>
        ) : null}
      </div>
    );
  }
}


SyntaxError.propTypes = {
  errors: PropTypes.object
};

export default EditorErrors;

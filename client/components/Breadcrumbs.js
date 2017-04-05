import React from 'react';
import { Link } from 'react-router';
import * as styles from '../styles/breacdrumbs.scss';

class Crumb extends React.Component {
  render() {
    return <span>
      {this.props.showNext ? <i className="fa fa-angle-right"> </i> : null}
      <Link to={this.props.path}>{this.props.name}</Link>
    </span>;
  }
}

class Breadcrumbs extends React.Component {
  render() {
    let { crumbs } = this.props;
    return (
      <div className={styles.breadcrumbs}>
        {crumbs.map((crumb, i) => {
          return <Crumb key={i} name={crumb[0]} path={crumb[1]} showNext={i > 0} />;
        })}
      </div>
    );
  }
}

export default Breadcrumbs;
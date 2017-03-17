import React from 'react';
import { Link } from 'react-router';
import { menu, logo, active, icon } from '../styles/menu.scss';

const Menu = () =>
  <div className={menu}>
    <div className={logo}>
      BackQuote
    </div>
    <nav>
      <ul>
        <li>
          <Link to="/" onlyActiveOnIndex activeClassName={active}>
            <i className={`fa fa-dashboard ${icon}`}> </i>{' '}Dashboard
          </Link>
        </li>
        <li>
          <Link to="/controls" onlyActiveOnIndex activeClassName={active}>
            <i className={`fa fa-cog ${icon}`}> </i>{' '}Controls
          </Link>
        </li>
        <li>
          <Link to="/backtests" onlyActiveOnIndex activeClassName={active}>
            <i className={`fa fa-line-chart ${icon}`}> </i>{' '}Backtests
          </Link>
        </li>
      </ul>
    </nav>
  </div>;

export default Menu;

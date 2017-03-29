import React from 'react';
import { Link } from 'react-router';
import { menu, logo, active, icon, backquote } from '../styles/menu.scss';

const Menu = () =>
  <div className={menu}>
    <div className={logo}>
      <p className={backquote}>{'`'}</p>
    </div>
    <nav>
      <ul>
        <li>
          <Link to="/" onlyActiveOnIndex activeClassName={active}>
            <i className={`fa fa-dashboard ${icon}`}> </i><span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/controls" onlyActiveOnIndex activeClassName={active}>
            <i className={`fa fa-cog ${icon}`}> </i><span>Controls</span>
          </Link>
        </li>
        <li>
          <Link to="/backtests" activeClassName={active}>
            <i className={`fa fa-line-chart ${icon}`}> </i><span>Backtests</span>
          </Link>
        </li>
      </ul>
    </nav>
  </div>;

export default Menu;

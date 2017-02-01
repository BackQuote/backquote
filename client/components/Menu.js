import React from 'react';
import { Link } from 'react-router';
import { menu, logo, active } from '../styles/menu.scss';

const Menu = () =>
  <div className={menu}>
    <div className={logo}>
      BackQuote
    </div>
    <nav>
      <ul>
        <li>
          <Link to="/" onlyActiveOnIndex activeClassName={active}>Dashboard</Link>
        </li>
        <li>
          <Link to="/controls" onlyActiveOnIndex activeClassName={active}>Controls</Link>
        </li>
      </ul>
    </nav>
  </div>;

export default Menu;

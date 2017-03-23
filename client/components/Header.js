import React from 'react';
import { header } from '../styles/header.scss';
import LoadingBar from 'react-redux-loading-bar';

const Header = () =>
    <div>
      <header className={header}>
        Backtester Platform
      </header>
      <LoadingBar style={{ backgroundColor: '#77b6ff', position: 'relative', top: 0, zIndex: 40}} />
    </div>;

export default Header;

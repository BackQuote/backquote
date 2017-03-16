import React, { PropTypes } from 'react';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { app } from '../styles/app.scss';
import { mainPanel, content } from '../styles/mainPanel.scss';
require('font-awesome/css/font-awesome.css');

const App = ({ children }) =>
  <div className={app}>
    <Menu/>
    <div className={mainPanel}>
      <Header/>
      <div className={content}>
        { children }
      </div>
      <Footer/>
    </div>
  </div>;

App.propTypes = {
  children: PropTypes.object
};

export default App;

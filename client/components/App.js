import React, { PropTypes } from 'react';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { app } from '../styles/app.scss';
import { mainPanel, content } from '../styles/mainPanel.scss';
require('font-awesome/css/font-awesome.css');
import { connect } from 'react-redux';

import Notifications from 'react-notification-system-redux';


class App extends React.Component {
  render() {
    let { children, notifications } = this.props;
    return (
      <div className={app}>
        <Notifications notifications={notifications}/>
        <Menu/>
        <div className={mainPanel}>
          <Header/>
          <div className={content}>
            { children }
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  notifications: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  };
};

export default connect(
  mapStateToProps,
  null
)(App);

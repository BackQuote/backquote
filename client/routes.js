import React from 'react';
import { Route } from 'react-router';
import App from './components/App';
import ControlsPage from './containers/ControlsPage';

export default (
  <Route path="/" component={App}>
    <Route path="/controls" component={ControlsPage} />
  </Route>
);

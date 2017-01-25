import React from 'react';
import { Route } from 'react-router';
import App from './components/App';
import ControlsPage from './containers/ControlsPage';
import SimulationsPage from './containers/SimulationsPage';
import SimulationPage from './containers/SimulationPage';
import RunPage from './containers/RunPage';

export default (
  <Route path="/" component={App}>
    <Route path="/controls" component={ControlsPage} />
    <Route path="/simulations" component={SimulationsPage}/>
    <Route path="/simulation/:id" component={SimulationPage}/>
    <Route path="/run/:id" component={RunPage}/>
  </Route>
);

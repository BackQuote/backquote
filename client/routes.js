import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import ControlsPage from './containers/ControlsPage';
import BacktestListPage from './containers/BacktestListPage';
import BacktestPage from './containers/BacktestPage';
import SimulationPage from './containers/SimulationPage';
import DashboardPage from './containers/DashboardPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage} />
    <Route path="/dashboard" component={DashboardPage} />
    <Route path="/controls" component={ControlsPage} />
    <Route path="/backtests" component={BacktestListPage}/>
    <Route path="/backtest/:id" component={BacktestPage}/>
    <Route path="/simulation/:id" component={SimulationPage}/>
  </Route>
);

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import * as algorithms from './algorithms';
import * as templates from './templates';
import * as backtests from './backtests';
import * as simulation from './simulation';
import * as dailyResult from './dailyResult';
import * as simulations from './simulations';
import * as tickers from './tickers';
import * as stats from './stats';

const reducers = Object.assign({},
  algorithms,
  notifications,
  templates,
  backtests,
  simulation,
  dailyResult,
  simulations,
  tickers,
  stats
);

const rootReducer = combineReducers({
  routing,
  loadingBar,
  notifications,
  ...reducers,
});

export default rootReducer;
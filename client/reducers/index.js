import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import * as algorithms from './algorithms';
import * as templates from './templates';
import * as backtests from './backtests';
import * as simulation from './simulation';
import * as dailyResult from './dailyResult';
import * as simulations from './simulations';
import * as tickers from './tickers';

const reducers = Object.assign({},
  routing,
  algorithms,
  templates,
  backtests,
  simulation,
  dailyResult,
  simulations,
  tickers
);

const rootReducer = combineReducers({
  routing,
  ...reducers,
  loadingBar: loadingBarReducer,
});

export default rootReducer;
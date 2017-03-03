import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as algorithms from './algorithms';
import * as templates from './templates';
import * as backtests from './backtests';
import * as days from './days';
import * as dailyResult from './dailyResult';
import * as simulations from './simulations';
import * as tickers from './tickers';

const reducers = Object.assign({},
  routing,
  algorithms,
  templates,
  backtests,
  days,
  dailyResult,
  simulations,
  tickers
);

const rootReducer = combineReducers({
  routing,
  ...reducers
});

export default rootReducer;
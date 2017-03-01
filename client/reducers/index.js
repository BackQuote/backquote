import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { algorithms, algorithmsIsLoading, algorithmsHasErrored } from './algorithms';
import { backtests, backtestsIsLoading, backtestsHasErrored } from './backtests';
import { days, daysIsLoading, daysHasErrored } from './days';

const rootReducer = combineReducers({
  routing,
  algorithms,
  algorithmsIsLoading,
  algorithmsHasErrored,
  backtests,
  backtestsIsLoading,
  backtestsHasErrored,
  days,
  daysIsLoading,
  daysHasErrored,
});

export default rootReducer;
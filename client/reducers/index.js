import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { algorithms, algorithmsIsLoading, algorithmsHasErrored } from './algorithms';
import { backtests, backtestsIsLoading, backtestsHasErrored } from './backtests';

const rootReducer = combineReducers({
  routing,
  algorithms,
  algorithmsIsLoading,
  algorithmsHasErrored,
  backtests,
  backtestsIsLoading,
  backtestsHasErrored
});

export default rootReducer;
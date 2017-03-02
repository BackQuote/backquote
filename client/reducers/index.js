import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { algorithms, algorithmsIsLoading, algorithmsHasErrored } from './algorithms';
import { templates, templatesIsLoading, templatesHasErrored } from './templates';
import { backtests, backtestsIsLoading, backtestsHasErrored } from './backtests';
import { days, daysIsLoading, daysHasErrored } from './days';
import { dailyResult, dailyResultIsLoading, dailyResultHasErrored } from './dailyResult';

const rootReducer = combineReducers({
  routing,
  algorithms,
  algorithmsIsLoading,
  algorithmsHasErrored,
  templates,
  templatesIsLoading,
  templatesHasErrored,
  backtests,
  backtestsIsLoading,
  backtestsHasErrored,
  dailyResult,
  dailyResultIsLoading,
  dailyResultHasErrored,
  days,
  daysIsLoading,
  daysHasErrored,
});

export default rootReducer;
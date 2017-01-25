import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { algorithms, algorithmsIsLoading, algorithmsHasErrored } from './algorithms';
import { simulations, simulationsIsLoading, simulationsHasErrored } from './simulations';

const rootReducer = combineReducers({
  routing,
  algorithms,
  algorithmsIsLoading,
  algorithmsHasErrored,
  simulations,
  simulationsIsLoading,
  simulationsHasErrored
});

export default rootReducer;
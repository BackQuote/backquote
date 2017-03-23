import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function simulationsHasErrored(hasErrored) {
  return {
    type: types.SIMULATIONS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function simulationsFetchDataSuccess(simulations) {
  return {
    type: types.SIMULATIONS_FETCH_DATA_SUCCESS,
    simulations
  };
}

export function fetchSimulations(id) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`backtests/${id}`)
      .then((simulations) => {
        dispatch(simulationsFetchDataSuccess(simulations));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(simulationsHasErrored(true)));
  };
}
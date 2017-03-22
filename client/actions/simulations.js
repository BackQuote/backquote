import * as types from './types';
import api from '../api';

export function simulationsHasErrored(hasErrored) {
  return {
    type: types.SIMULATIONS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function simulationsIsLoading(isLoading) {
  return {
    type: types.SIMULATIONS_IS_LOADING,
    isLoading: isLoading
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
    dispatch(simulationsIsLoading(true));
    api.get(`backtests/${id}`)
      .then((simulations) => {
        dispatch(simulationsFetchDataSuccess(simulations));
        dispatch(simulationsIsLoading(false));
      })
      .catch(() => dispatch(simulationsHasErrored(true)));
  };
}
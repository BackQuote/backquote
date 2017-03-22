import * as types from './types';
import api from '../api';

export function simulationHasErrored(hasErrored) {
  return {
    type: types.SIMULATION_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function simulationIsLoading(isLoading) {
  return {
    type: types.SIMULATION_IS_LOADING,
    isLoading: isLoading
  };
}

export function simulationFetchDataSuccess(days) {
  return {
    type: types.SIMULATION_FETCH_DATA_SUCCESS,
    days
  };
}

export function fetchSimulation(id) {
  return (dispatch) => {
    dispatch(simulationIsLoading(true));
    api.get(`simulations/${id}`)
      .then((simulation) => {
        dispatch(simulationFetchDataSuccess(simulation));
        dispatch(simulationIsLoading(false));
      })
      .catch(() => dispatch(simulationHasErrored(true)));
  };
}
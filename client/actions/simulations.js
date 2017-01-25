import * as types from './types';

export function simulationsHasErrored(bool) {
  return {
    type: types.SIMULATIONS_HAS_ERRORED,
    hasErrored: bool
  };
}

export function simulationsIsLoading(bool) {
  return {
    type: types.SIMULATIONS_IS_LOADING,
    isLoading: bool
  };
}

export function simulationsFetchDataSuccess(simulations) {
  return {
    type: types.SIMULATIONS_FETCH_DATA_SUCCESS,
    simulations
  };
}

export function fetchSimulations(url) {
  return (dispatch) => {
    dispatch(simulationsIsLoading(true));
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(simulationsIsLoading(false));
        return response;
      })
      .then((response) => response.json())
      .then((simulations) => dispatch(simulationsFetchDataSuccess(simulations)))
      .catch(() => dispatch(simulationsHasErrored(true)));
  };
}
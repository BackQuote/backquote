import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function simulationHasErrored(hasErrored) {
  return {
    type: types.SIMULATION_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function simulationFetchDataSuccess(simulation) {
  return {
    type: types.SIMULATION_FETCH_DATA_SUCCESS,
    simulation
  };
}

export function fetchSimulation(id) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`simulations/${id}`)
      .then((simulation) => {
        dispatch(hideLoading());
        dispatch(simulationFetchDataSuccess(simulation));
      })
      .catch(() => dispatch(simulationHasErrored(true)));
  };
}
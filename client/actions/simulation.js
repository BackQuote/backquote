import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function simulationFetchSuccess(simulation) {
  return {
    type: types.FETCH_SIMULATION_SUCCESS,
    simulation
  };
}

export function fetchSimulation(id) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`simulations/${id}`)
      .then((simulation) => {
        dispatch(hideLoading());
        dispatch(simulationFetchSuccess(simulation));
      })
      .catch((error) => {
        dispatch(Notifications.error({
          title: 'Unable to fetch simulation',
          message: error.message
        }));
      });
  };
}
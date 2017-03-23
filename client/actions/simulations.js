import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function simulationsFetchSuccess(simulations) {
  return {
    type: types.FETCH_SIMULATIONS_SUCCESS,
    simulations
  };
}

export function fetchSimulations(backtestId) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`backtests/${backtestId}/simulations`)
      .then((simulations) => {
        dispatch(simulationsFetchSuccess(simulations));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(Notifications.error({
          title: 'Unable to fetch simulations',
          message: error.message
        }));
      });
  };
}
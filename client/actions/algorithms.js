import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function algorithmsFetchSuccess(algorithms) {
  return {
    type: types.FETCH_ALGORITHMS_SUCCESS,
    algorithms
  };
}

export function fetchAlgorithms() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('algorithms')
      .then((algorithms) => {
        dispatch(algorithmsFetchSuccess(algorithms));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(Notifications.error({
          title: 'Unable to fetch algorithms',
          message: error.message
        }));
      });
  };
}

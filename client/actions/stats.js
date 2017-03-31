import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function statsFetchSuccess(stats) {
  return {
    type: types.FETCH_STATS_SUCCESS,
    stats
  };
}

export function fetchStats() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('stats')
      .then((stats) => {
        dispatch(statsFetchSuccess(stats));
        dispatch(hideLoading());
      });
  };
}

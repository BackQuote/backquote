import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function backtestsHasErrored(hasErrored) {
  return {
    type: types.BACKTESTS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function backtestsFetchDataSuccess(backtests) {
  return {
    type: types.BACKTESTS_FETCH_DATA_SUCCESS,
    backtests
  };
}

export function fetchBacktests() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('backtests')
      .then((backtests) => {
        dispatch(backtestsFetchDataSuccess(backtests));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(backtestsHasErrored(true)));
  };
}

export function launchBacktest(algorithm, algorithmId, params, tickers) {
  return (dispatch) => {
    api.post('backtester/run', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({algorithm, algorithmId, params, tickers})
    }).then(() => {
      dispatch(Notifications.success({
        title: 'Success',
        message: 'Backtest started successfully.'
      }));
    }).catch((error) => {
      dispatch(Notifications.error({
        title: 'Unable to execute backtest',
        message: error.message
      }));
    });
  };
}
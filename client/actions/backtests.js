import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function backtestsFetchSuccess(backtests) {
  return {
    type: types.FETCH_BACKTESTS_SUCCESS,
    backtests
  };
}

export function fetchBacktests() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('backtests')
      .then((backtests) => {
        dispatch(backtestsFetchSuccess(backtests));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(Notifications.error({
          title: 'Unable to fetch backtests',
          message: error.message
        }));
      });
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
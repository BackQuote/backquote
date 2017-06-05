import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function tickersFetchSuccess(tickers) {
  return {
    type: types.FETCH_TICKERS_SUCCESS,
    tickers
  };
}

export function fetchTickers() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('tickers')
      .then((tickers) => {
        dispatch(tickersFetchSuccess(tickers));
        dispatch(hideLoading());
      }, error => {
        dispatch(Notifications.error({
          title: 'Unable to fetch tickers',
          message: error.message
        }));
      });
  };
}

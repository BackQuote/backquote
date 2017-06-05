import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function quotesFetchSuccess(quotes) {
  return {
    type: types.FETCH_QUOTES_SUCCESS,
    quotes
  };
}

export function tradesFetchSuccess(trades) {
  return {
    type: types.FETCH_TRADES_SUCCESS,
    trades
  };
}

export function fetchDailyResult(id, dayId, ticker) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`quotes/${dayId}/${ticker}`)
      .then((quotes) => {
        dispatch(quotesFetchSuccess(quotes));
        dispatch(hideLoading());
      }, error => {
        dispatch(Notifications.error({
          title: 'Unable to fetch quotes',
          message: error.message
        }));
      });
    api.get(`trades/results/${id}`)
      .then((trades) => {
        dispatch(tradesFetchSuccess(trades));
        dispatch(hideLoading());
      }, error => {
        dispatch(Notifications.error({
          title: 'Unable to fetch trades',
          message: error.message
        }));
      });
  };
}
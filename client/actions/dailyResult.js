import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function dailyResultHasErrored(hasErrored) {
  return {
    type: types.DAILY_RESULT_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function quotesFetchDataSuccess(quotes) {
  return {
    type: types.QUOTES_FETCH_DATA_SUCCESS,
    quotes
  };
}

export function tradesFetchDataSuccess(trades) {
  return {
    type: types.TRADES_FETCH_DATA_SUCCESS,
    trades
  };
}

export function fetchDailyResult(id, dayId, ticker) {
  return (dispatch) => {
    dispatch(showLoading());
    api.get(`quotes/${dayId}/${ticker}`)
      .then((quotes) => {
        dispatch(quotesFetchDataSuccess(quotes));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(dailyResultHasErrored(true)));
    api.get(`trades/results/${id}`)
      .then((trades) => {
        dispatch(tradesFetchDataSuccess(trades));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(dailyResultHasErrored(true)));
  };
}
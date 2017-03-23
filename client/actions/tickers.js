import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function tickersHasErrored(hasErrored) {
  return {
    type: types.TICKERS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function tickersFetchDataSuccess(tickers) {
  return {
    type: types.TICKERS_FETCH_DATA_SUCCESS,
    tickers
  };
}

export function fetchTickers() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('tickers')
      .then((tickers) => {
        dispatch(tickersFetchDataSuccess(tickers));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(tickersHasErrored(true)));
  };
}

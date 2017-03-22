import * as types from './types';
import api from '../api';

export function dailyResultHasErrored(hasErrored) {
  return {
    type: types.DAILY_RESULT_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function dailyResultIsLoading(isLoading) {
  return {
    type: types.DAILY_RESULT_IS_LOADING,
    isLoading: isLoading
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
    dispatch(dailyResultIsLoading(true));
    api.get(`quotes/${dayId}/${ticker}`)
      .then((quotes) => {
        dispatch(quotesFetchDataSuccess(quotes));
        dispatch(dailyResultIsLoading(false));
      })
      .catch(() => dispatch(dailyResultHasErrored(true)));
    api.get(`trades/results/${id}`)
      .then((trades) => {
        dispatch(tradesFetchDataSuccess(trades));
        dispatch(dailyResultIsLoading(false));
      })
  };
}
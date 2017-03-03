import * as types from './types';
import api from '../api';

export function tickersHasErrored(hasErrored) {
  return {
    type: types.TICKERS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function tickersIsLoading(isLoading) {
  return {
    type: types.TICKERS_IS_LOADING,
    isLoading: isLoading
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
    dispatch(tickersIsLoading(true));
    api.get('tickers')
      .then((tickers) => {
        dispatch(tickersFetchDataSuccess(tickers));
        dispatch(tickersIsLoading(false));
      })
      .catch(() => dispatch(tickersHasErrored(true)));
  };
}

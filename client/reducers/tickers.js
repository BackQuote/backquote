import * as types from '../actions/types';

export function tickersHasErrored(state = false, action) {
  switch (action.type) {
    case types.TICKERS_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function tickers(state = [], action) {
  switch (action.type) {
    case types.TICKERS_FETCH_DATA_SUCCESS:
      return action.tickers;
    default:
      return state;
  }
}
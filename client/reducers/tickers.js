import * as types from '../actions/types';

export function tickers(state = [], action) {
  switch (action.type) {
    case types.FETCH_TICKERS_SUCCESS:
      return action.tickers;
    default:
      return state;
  }
}
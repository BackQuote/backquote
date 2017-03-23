import * as types from '../actions/types';

export function quotes(state = [], action) {
  switch (action.type) {
    case types.FETCH_QUOTES_SUCCESS:
      return action.quotes;
    default:
      return state;
  }
}

export function trades(state = [], action) {
  switch (action.type) {
    case types.FETCH_TRADES_SUCCESS:
      return action.trades;
    default:
      return state;
  }
}
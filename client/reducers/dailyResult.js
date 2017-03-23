import * as types from '../actions/types';

export function dailyResultHasErrored(state = false, action) {
  switch (action.type) {
    case types.DAILY_RESULT_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function quotes(state = [], action) {
  switch (action.type) {
    case types.QUOTES_FETCH_DATA_SUCCESS:
      return action.quotes;
    default:
      return state;
  }
}

export function trades(state = [], action) {
  switch (action.type) {
    case types.TRADES_FETCH_DATA_SUCCESS:
      return action.trades;
    default:
      return state;
  }
}
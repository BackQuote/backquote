import * as types from '../actions/types';

export function dailyResultHasErrored(state = false, action) {
  switch (action.type) {
    case types.DAILY_RESULT_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}
export function dailyResultIsLoading(state = false, action) {
  switch (action.type) {
    case types.DAILY_RESULT_IS_LOADING:
      return action.isLoading;
    default:
      return state;
  }
}
export function dailyResult(state = {}, action) {
  switch (action.type) {
    case types.QUOTES_FETCH_DATA_SUCCESS:
      return action.quotes;
    case types.TRADES_FETCH_DATA_SUCCESS:
      return action.trades;
    default:
      return state;
  }
}
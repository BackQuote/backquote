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
    case types.DAILY_RESULT_FETCH_DATA_SUCCESS:
      return action.dailyResult;
    default:
      return state;
  }
}
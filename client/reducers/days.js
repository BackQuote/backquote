import * as types from '../actions/types';

export function daysHasErrored(state = false, action) {
  switch (action.type) {
    case types.DAYS_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}
export function daysIsLoading(state = false, action) {
  switch (action.type) {
    case types.DAYS_IS_LOADING:
      return action.isLoading;
    default:
      return state;
  }
}
export function days(state = [], action) {
  switch (action.type) {
    case types.DAYS_FETCH_DATA_SUCCESS:
      return action.days;
    default:
      return state;
  }
}
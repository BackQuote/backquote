import * as types from '../actions/types';

export function backtestsHasErrored(state = false, action) {
  switch (action.type) {
    case types.BACKTESTS_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function backtests(state = [], action) {
  switch (action.type) {
    case types.BACKTESTS_FETCH_DATA_SUCCESS:
      return action.backtests;
    default:
      return state;
  }
}
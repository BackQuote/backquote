import * as types from '../actions/types';

export function stats(state = {}, action) {
  switch (action.type) {
    case types.FETCH_STATS_SUCCESS:
      return action.stats;
    default:
      return state;
  }
}
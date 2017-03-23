import * as types from '../actions/types';

export function backtests(state = [], action) {
  switch (action.type) {
    case types.FETCH_BACKTESTS_SUCCESS:
      return action.backtests;
    default:
      return state;
  }
}
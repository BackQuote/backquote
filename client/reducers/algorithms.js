import * as types from '../actions/types';

export function algorithms(state = [], action) {
  switch (action.type) {
    case types.FETCH_ALGORITHMS_SUCCESS:
      return action.algorithms;
    default:
      return state;
  }
}
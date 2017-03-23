import * as types from '../actions/types';

export function algorithmsHasErrored(state = false, action) {
  switch (action.type) {
    case types.ALGORITHMS_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function algorithms(state = [], action) {
  switch (action.type) {
    case types.ALGORITHMS_FETCH_DATA_SUCCESS:
      return action.algorithms;
    default:
      return state;
  }
}
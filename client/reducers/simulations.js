import * as types from '../actions/types';

export function simulationsHasErrored(state = false, action) {
  switch (action.type) {
    case types.SIMULATIONS_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function simulations(state = [], action) {
  switch (action.type) {
    case types.SIMULATIONS_FETCH_DATA_SUCCESS:
      return action.simulations;
    default:
      return state;
  }
}

import * as types from '../actions/types';

export function simulations(state = [], action) {
  switch (action.type) {
    case types.FETCH_SIMULATIONS_SUCCESS:
      return action.simulations;
    default:
      return state;
  }
}

import * as types from '../actions/types';

export function simulation(state = {}, action) {
  switch (action.type) {
    case types.FETCH_SIMULATION_SUCCESS:
      return action.simulation;
    default:
      return state;
  }
}
import * as types from '../actions/types';

export function simulationHasErrored(state = false, action) {
  switch (action.type) {
    case types.SIMULATION_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function simulation(state = {}, action) {
  switch (action.type) {
    case types.SIMULATION_FETCH_DATA_SUCCESS:
      return action.simulation;
    default:
      return state;
  }
}
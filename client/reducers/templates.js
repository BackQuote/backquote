import * as types from '../actions/types';

export function templates(state = [], action) {
  switch (action.type) {
    case types.FETCH_TEMPLATES_SUCCESS:
      return action.templates;
    default:
      return state;
  }
}
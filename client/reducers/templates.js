import * as types from '../actions/types';

export function templatesHasErrored(state = false, action) {
  switch (action.type) {
    case types.TEMPLATES_HAS_ERRORED:
      return action.hasErrored;
    default:
      return state;
  }
}

export function templates(state = [], action) {
  switch (action.type) {
    case types.TEMPLATES_FETCH_DATA_SUCCESS:
      return action.templates;
    default:
      return state;
  }
}
import * as types from './types';
import api from '../api';

export function templatesHasErrored(hasErrored) {
  return {
    type: types.TEMPLATES_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function templatesIsLoading(isLoading) {
  return {
    type: types.TEMPLATES_IS_LOADING,
    isLoading: isLoading
  };
}

export function templatesFetchDataSuccess(templates) {
  return {
    type: types.TEMPLATES_FETCH_DATA_SUCCESS,
    templates
  };
}

export function fetchTemplates() {
  return (dispatch) => {
    dispatch(templatesIsLoading(true));
    api.get('templates')
      .then((templates) => {
        dispatch(templatesFetchDataSuccess(templates));
        dispatch(templatesIsLoading(false));
      })
      .catch(() => dispatch(templatesHasErrored(true)));
  };
}
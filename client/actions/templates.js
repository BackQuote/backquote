import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function templatesHasErrored(hasErrored) {
  return {
    type: types.TEMPLATES_HAS_ERRORED,
    hasErrored: hasErrored
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
    dispatch(showLoading());
    api.get('templates')
      .then((templates) => {
        dispatch(templatesFetchDataSuccess(templates));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(templatesHasErrored(true)));
  };
}
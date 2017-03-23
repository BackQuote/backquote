import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
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

export function saveTemplate(algorithm, params) {
  return (dispatch) => {
    api.post('templates', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({algorithm, params})
    }).then(() => {
      dispatch(Notifications.success({
        title: 'Success',
        message: 'Template saved successfully.'
      }));
    }).catch((error) => {
      dispatch(Notifications.error({
        title: 'Unable to save template',
        message: error.message
      }));
    });
  };
}
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Notifications from 'react-notification-system-redux';
import * as types from './types';
import api from '../api';

export function templatesFetchSuccess(templates) {
  return {
    type: types.FETCH_TEMPLATES_SUCCESS,
    templates
  };
}

export function fetchTemplates() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('templates')
      .then((templates) => {
        dispatch(templatesFetchSuccess(templates));
        dispatch(hideLoading());
      }, error => {
        dispatch(Notifications.error({
          title: 'Unable to fetch templates',
          message: error.message
        }));
      });
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
    }).then((response) => {
      if (response.error) {
        dispatch(Notifications.info({
          message: response.message
        }));
      } else {
        dispatch(Notifications.success({
          title: 'Success',
          message: 'Template saved successfully.'
        }));
      }
    }, error => {
      dispatch(Notifications.error({
        title: 'Unable to save template',
        message: error.message
      }));
    });
  };
}
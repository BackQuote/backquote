import * as types from './types';
import api from '../api';

export function daysHasErrored(hasErrored) {
  return {
    type: types.DAYS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function daysIsLoading(isLoading) {
  return {
    type: types.DAYS_IS_LOADING,
    isLoading: isLoading
  };
}

export function daysFetchDataSuccess(days) {
  return {
    type: types.DAYS_FETCH_DATA_SUCCESS,
    days
  };
}

export function fetchDays() {
  return (dispatch) => {
    dispatch(daysIsLoading(true));
    api.get('days')
      .then((days) => {
        dispatch(daysFetchDataSuccess(days));
        dispatch(daysIsLoading(false));
      })
      .catch(() => dispatch(daysHasErrored(true)));
  };
}
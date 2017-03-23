import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function backtestsHasErrored(hasErrored) {
  return {
    type: types.BACKTESTS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function backtestsFetchDataSuccess(backtests) {
  return {
    type: types.BACKTESTS_FETCH_DATA_SUCCESS,
    backtests
  };
}

export function fetchBacktests() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('backtests')
      .then((backtests) => {
        dispatch(backtestsFetchDataSuccess(backtests));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(backtestsHasErrored(true)));
  };
}
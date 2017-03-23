import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './types';
import api from '../api';

export function algorithmsHasErrored(hasErrored) {
  return {
    type: types.ALGORITHMS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function algorithmsFetchDataSuccess(algorithms) {
  return {
    type: types.ALGORITHMS_FETCH_DATA_SUCCESS,
    algorithms
  };
}

export function fetchAlgorithms() {
  return (dispatch) => {
    dispatch(showLoading());
    api.get('algorithms')
      .then((algorithms) => {
        dispatch(algorithmsFetchDataSuccess(algorithms));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(algorithmsHasErrored(true)));
  };
}

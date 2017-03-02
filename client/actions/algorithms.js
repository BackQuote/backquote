import * as types from './types';
import api from '../api';

export function algorithmsHasErrored(hasErrored) {
  return {
    type: types.ALGORITHMS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function algorithmsIsLoading(isLoading) {
  return {
    type: types.ALGORITHMS_IS_LOADING,
    isLoading: isLoading
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
    dispatch(algorithmsIsLoading(true));
    api.get('algorithms')
      .then((algorithms) => {
        dispatch(algorithmsFetchDataSuccess(algorithms));
        dispatch(algorithmsIsLoading(false));
      })
      .catch(() => dispatch(algorithmsHasErrored(true)));
  };
}

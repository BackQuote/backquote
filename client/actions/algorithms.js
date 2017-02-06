import * as types from './types';

export function algorithmsHasErrored(bool) {
  return {
    type: types.ALGORITHMS_HAS_ERRORED,
    hasErrored: bool
  };
}

export function algorithmsIsLoading(bool) {
  return {
    type: types.ALGORITHMS_IS_LOADING,
    isLoading: bool
  };
}

export function algorithmsFetchDataSuccess(algorithms) {
  return {
    type: types.ALGORITHMS_FETCH_DATA_SUCCESS,
    algorithms
  };
}

export function fetchAlgorithms(url) {
  return (dispatch) => {
    dispatch(algorithmsIsLoading(true));
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(algorithmsIsLoading(false));
        return response;
      })
      .then((response) => response.json())
      .then((algorithms) => dispatch(algorithmsFetchDataSuccess(algorithms)))
      .catch(() => dispatch(algorithmsHasErrored(true)));
  };
}
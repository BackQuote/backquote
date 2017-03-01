import * as types from './types';
import api from '../api';

export function backtestsHasErrored(hasErrored) {
  return {
    type: types.BACKTESTS_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function backtestsIsLoading(isLoading) {
  return {
    type: types.BACKTESTS_IS_LOADING,
    isLoading: isLoading
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
    dispatch(backtestsIsLoading(true));
    api.get('backtests')
      .then((backtests) => {
        dispatch(backtestsFetchDataSuccess(backtests));
        dispatch(backtestsIsLoading(false));
      })
      .catch(() => dispatch(backtestsHasErrored(true)));
  };
}
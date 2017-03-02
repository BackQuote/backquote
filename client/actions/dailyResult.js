import * as types from './types';
import api from '../api';

export function dailyResultHasErrored(hasErrored) {
  return {
    type: types.DAILY_RESULT_HAS_ERRORED,
    hasErrored: hasErrored
  };
}

export function dailyResultIsLoading(isLoading) {
  return {
    type: types.DAILY_RESULT_IS_LOADING,
    isLoading: isLoading
  };
}

export function dailyResultFetchDataSuccess(dailyResult) {
  return {
    type: types.DAILY_RESULT_FETCH_DATA_SUCCESS,
    dailyResult
  };
}

export function fetchDailyResult() {
  return (dispatch) => {
    dispatch(dailyResultIsLoading(true));
    api.get('daily_result')
      .then((dailyResult) => {
        dispatch(dailyResultFetchDataSuccess(dailyResult));
        dispatch(dailyResultIsLoading(false));
      })
      .catch(() => dispatch(dailyResultHasErrored(true)));
  };
}
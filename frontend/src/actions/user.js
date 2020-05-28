import { apiGetCall, apiPutCall } from "../apis/api";
import { CHANGE_USER_EMAIL, GET_QUOTA_STATS, GET_USER_DETAILS } from "./types";
import { setError } from "./errors";
import { getApiError } from "../helpers";

export const getQuotaStats = username => dispatch => {
  apiGetCall(`/user/${username}/quota`)
    .then(response =>
      dispatch({ type: GET_QUOTA_STATS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUserDetails = username => dispatch => {
  apiGetCall(`/user/${username}/details`)
    .then(response =>
      dispatch({ type: GET_USER_DETAILS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const changeUserEmail = (username, value) => dispatch => {
  return apiPutCall(`/user/${username}/details/update`, value).then(() =>
    dispatch({ type: CHANGE_USER_EMAIL, email: value.email })
  );
};

export const changeUserPassword = (username, password) => {
  return apiPutCall(`/user/${username}/details/update`, password);
};

import { apiGetCall, apiPutCall } from "../apis/api";
import {
  CHANGE_USER_EMAIL,
  GET_QUOTA_STATS,
  ADMIN_GET_TOTAL_QUOTA_USED,
  GET_USER_DETAILS,
  ADMIN_GET_USERS,
  ADMIN_GET_USER_DETAILS
} from "./types";
import { setError } from "./errors";
import { getApiError, getFilterSort } from "../helpers";

export const getQuotaStats = username => dispatch => {
  apiGetCall(`/user/${username}/quota`)
    .then(response =>
      dispatch({ type: GET_QUOTA_STATS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUserDetails = username => dispatch => {
  getUserDetailsBase(username)
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

export const getUsedStorage = () => dispatch => {
  apiGetCall("/user/admin/users/quota/used")
    .then(response =>
      dispatch({ type: ADMIN_GET_TOTAL_QUOTA_USED, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUsers = (
  page,
  size,
  sorter = { order: "", field: "" }
) => dispatch => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (sorter) params.append("sort", getFilterSort(sorter));

  return apiGetCall("/user/admin/users", { params })
    .then(response => {
      dispatch({ type: ADMIN_GET_USERS, payload: response.data });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const updateUser = user => dispatch => {
  return apiPutCall("", user);
};

const getUserDetailsBase = username => {
  return apiGetCall(`/user/${username}/details`);
};

export const adminGetUserDetails = username => dispatch => {
  return getUserDetailsBase(username)
    .then(response =>
      dispatch({ type: ADMIN_GET_USER_DETAILS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

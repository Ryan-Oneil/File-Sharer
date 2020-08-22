import { createSlice } from "@reduxjs/toolkit";
import { apiGetCall, apiPutCall } from "../apis/api";
import { setError } from "./globalErrorReducer";
import { getApiError, getFilterSort } from "../helpers";

export const changeUserPassword = (username, password) => {
  return apiPutCall(`/user/${username}/details/update`, password);
};

export const getUsedStorage = () => dispatch => {
  apiGetCall("/user/admin/users/quota/used")
    .then(response => dispatch(getTotalUsedSpace(response.data)))
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getAllUsers = (
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
      dispatch(getUsers(response.data));
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

//Update this to update stuff
export const updateUser = user => dispatch => {
  const userDetails = { email: user.email, password: user.password };

  return apiPutCall(`/user/${user.username}/details/update`, userDetails);
};

const getUserDetailsBase = username => {
  return apiGetCall(`/user/${username}/details`);
};

export const adminGetUserDetails = username => dispatch => {
  return getUserDetailsBase(username)
    .then(response => dispatch(getUserDetails(response.data)))
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUserFileStats = username => dispatch => {
  return apiGetCall(`/user/${username}/links/stats`)
    .then(response => dispatch(getUserFileShareStats(response.data)))
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getAdminLinkStats = () => dispatch => {
  return apiGetCall("/admin/link/stats")
    .then(response => dispatch(getFileShareStats(response.data)))
    .catch(error => dispatch(setError(getApiError(error))));
};

export const slice = createSlice({
  name: "admin",
  initialState: {
    totalUsed: 0,
    users: [],
    totalUsers: 0,
    fileShare: {
      totalViews: 0,
      totalLinks: 0,
      mostViewed: [],
      recentShared: []
    },
    user: {
      account: {
        name: "",
        email: "",
        role: "",
        enabled: "",
        quota: { used: 0, max: 0, ignoreQuota: false }
      },
      files: [],
      stats: { totalViews: 0, totalLinks: 0 }
    }
  },
  reducers: {
    getFileShareStats(state, action) {
      state.fileShare = action.payload;
    },
    getTotalUsedSpace(state, action) {
      state.totalUsed = action.payload;
    },
    getUsers(state, action) {
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
    },
    getUserFileShareStats(state, action) {
      state.user.stats = action.payload;
    },
    getUserDetails(state, action) {
      state.user.account = action.payload;
    }
  }
});
export default slice.reducer;
export const {
  getFileShareStats,
  getTotalUsedSpace,
  getUsers,
  getUserFileShareStats,
  getUserDetails
} = slice.actions;

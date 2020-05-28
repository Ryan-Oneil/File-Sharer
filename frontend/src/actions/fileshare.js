import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall
} from "../apis/api";
import {
  ADD_FILES,
  DELETE_FILE,
  DELETE_LINK,
  EDIT_LINK,
  GET_LINK_DETAILS,
  GET_SHARED_FILES,
  GET_USER_LINK_STATS
} from "./types";
import { setError } from "./errors";
import { getApiError } from "../helpers";

export const getUserFiles = user => dispatch => {
  apiGetCall(`/user/${user}/links`)
    .then(r => {
      dispatch({ type: GET_SHARED_FILES, payload: r.data });
    })
    .catch(error => {
      dispatch(setError(getApiError(error)));
    });
};

export const deleteLink = linkID => dispatch => {
  apiDeleteCall(`/delete/${linkID}`)
    .then(() => {
      dispatch({ type: DELETE_LINK, payload: linkID });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getLinkDetails = linkID => dispatch => {
  apiGetCall(`/info/${linkID}`)
    .then(response => {
      dispatch({ type: GET_LINK_DETAILS, payload: response.data });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const deleteFile = (fileID, linkID) => dispatch => {
  apiDeleteCall(`/file/delete/${fileID}`)
    .then(() => {
      dispatch({ type: DELETE_FILE, fileID: fileID, linkID: linkID });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const addFiles = (files, linkID) => dispatch => {
  return uploadFiles(`/link/add/${linkID}`, files)
    .then(response => {
      dispatch({ type: ADD_FILES, files: response.data, linkID: linkID });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const uploadFiles = (endpoint, files, params = {}) => {
  let postData = new FormData();
  files.forEach(file => postData.append("file", file, file.name));

  let options = {
    params: params
  };
  return apiPostCall(endpoint, postData, options);
};

export const getUserLinkStats = user => dispatch => {
  apiGetCall(`/user/${user}/link/stats`)
    .then(response => {
      dispatch({ type: GET_USER_LINK_STATS, payload: response.data });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const editLink = (linkID, link) => dispatch => {
  return apiPutCall(`/link/edit/${linkID}`, link).then(() =>
    dispatch({ type: EDIT_LINK, link: link, linkID: linkID })
  );
};

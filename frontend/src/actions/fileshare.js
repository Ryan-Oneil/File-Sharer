import {
  apiDeleteCall,
  apiGetCall,
  apiPostCall,
  apiPutCall
} from "../apis/api";
import {
  ADD_FILES,
  ADMIN_GET_RECENT_LINKS,
  DELETE_FILE,
  DELETE_LINK,
  EDIT_LINK,
  GET_ADMIN_LINK_STATS,
  GET_LINK_DETAILS,
  ADMIN_GET_POPULAR_LINKS,
  GET_SHARED_FILES,
  GET_SHARED_FILES_PAGEABLE,
  GET_USER_LINK_COUNT,
  GET_USER_LINK_STATS,
  UPLOADER_ADD_FILE,
  UPLOADER_REMOVE_FILE,
  UPLOADER_RESET,
  UPLOADER_SET_LIMIT_REACHED,
  ADMIN_GET_USER_LINKS,
  ADMIN_GET_USER_FILESHARE_STATS
} from "./types";
import { setError } from "./errors";
import { getApiError, getFilterSort } from "../helpers";

export const deleteLink = linkID => dispatch => {
  apiDeleteCall(`/delete/${linkID}`)
    .then(() => {
      dispatch({ type: DELETE_LINK, payload: linkID });
    })
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getLinkDetails = linkID => dispatch => {
  return apiGetCall(`/info/${linkID}`)
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

  files.forEach(file => postData.append("file[]", file, file.name));

  let options = {
    params: params
  };
  return apiPostCall(endpoint, postData, options);
};

export const getUserLinkStats = user => dispatch => {
  return apiGetCall(`/user/${user}/links/stats`)
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

export const uploaderAddFile = file => dispatch => {
  dispatch({ type: UPLOADER_ADD_FILE, file: file });
};

export const uploaderRemoveFile = file => dispatch => {
  dispatch({ type: UPLOADER_REMOVE_FILE, file: file });
};

export const setHasReachedLimit = reachedLimit => dispatch => {
  dispatch({ type: UPLOADER_SET_LIMIT_REACHED, hasReach: reachedLimit });
};
export const resetUploader = () => dispatch => {
  dispatch({ type: UPLOADER_RESET });
};

export const getAdminLinkStats = () => dispatch => {
  return apiGetCall("/admin/link/stats")
    .then(response =>
      dispatch({ type: GET_ADMIN_LINK_STATS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getAllLinksPageable = (
  page,
  size,
  sorter = { order: "", field: "" }
) => dispatch => {
  return getLinksPageable("/admin/links", page, size, getFilterSort(sorter))
    .then(response =>
      dispatch({ type: GET_SHARED_FILES_PAGEABLE, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getPopularLinksPageable = (
  page,
  size,
  sortAttribute
) => dispatch => {
  return getLinksPageable("/admin/links", page, size, sortAttribute)
    .then(response =>
      dispatch({ type: ADMIN_GET_POPULAR_LINKS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getLinksPageable = (endpoint, page, size, sortAttribute) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (sortAttribute) params.append("sort", sortAttribute);

  return apiGetCall(endpoint, { params });
};

export const getRecentLinks = size => dispatch => {
  return getLinksPageable("/admin/links", 0, size, "creationDate,desc")
    .then(response =>
      dispatch({ type: ADMIN_GET_RECENT_LINKS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUserLinkCount = user => dispatch => {
  return apiGetCall(`/user/${user}/links/stat/total`)
    .then(response =>
      dispatch({ type: GET_USER_LINK_COUNT, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

const baseGetUserLinks = (
  username,
  page,
  size,
  sorter = { order: "", field: "" }
) => {
  return getLinksPageable(
    `/user/${username}/links`,
    page,
    size,
    getFilterSort(sorter)
  );
};

export const getUserLinks = (username, page, size, sorter) => dispatch => {
  return baseGetUserLinks(username, page, size, sorter)
    .then(response =>
      dispatch({ type: GET_SHARED_FILES, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const adminGetUserLinks = (username, page, size, sorter) => dispatch => {
  return baseGetUserLinks(username, page, size, sorter)
    .then(response =>
      dispatch({ type: ADMIN_GET_USER_LINKS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

export const getUserFileStats = username => dispatch => {
  return apiGetCall(`/user/${username}/links/stats`)
    .then(response =>
      dispatch({ type: ADMIN_GET_USER_FILESHARE_STATS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

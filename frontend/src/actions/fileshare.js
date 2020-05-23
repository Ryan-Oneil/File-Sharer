import { apiDeleteCall, apiGetCall } from "../apis/api";
import { DELETE_LINK, GET_SHARED_FILES } from "./types";
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
    .catch(error => {
      dispatch(setError(getApiError(error)));
    });
};

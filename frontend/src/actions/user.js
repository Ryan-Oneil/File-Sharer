import { apiGetCall } from "../apis/api";
import { GET_QUOTA_STATS } from "./types";
import { setError } from "./errors";
import { getApiError } from "../helpers";

export const getQuotaStats = username => dispatch => {
  apiGetCall(`/user/${username}/quota`)
    .then(response =>
      dispatch({ type: GET_QUOTA_STATS, payload: response.data })
    )
    .catch(error => dispatch(setError(getApiError(error))));
};

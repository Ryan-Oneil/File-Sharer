import {
  CHANGE_USER_EMAIL,
  GET_QUOTA_STATS,
  GET_TOTAL_USED_QUOTA,
  GET_USER_DETAILS,
  GET_USER_STATS
} from "../actions/types";

export default (
  state = {
    details: { name: "", email: "", role: "" },
    //Default quota given is 25gb
    storageQuota: { used: 0, max: 25 },
    admin: { totalUsed: 0 }
  },
  action
) => {
  switch (action.type) {
    case GET_USER_STATS: {
      return { ...state };
    }
    case GET_QUOTA_STATS: {
      return { ...state, storageQuota: action.payload };
    }
    case GET_USER_DETAILS: {
      return { ...state, details: action.payload };
    }
    case CHANGE_USER_EMAIL: {
      return { ...state, details: { ...state.details, email: action.email } };
    }
    case GET_TOTAL_USED_QUOTA: {
      return { ...state, admin: { totalUsed: action.payload } };
    }
    default: {
      return { ...state };
    }
  }
};

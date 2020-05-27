import { GET_QUOTA_STATS, GET_USER_STATS } from "../actions/types";

export default (
  state = {
    details: { name: "", email: "" },
    storageQuota: { used: 0, max: 0 }
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
    default: {
      return { ...state };
    }
  }
};

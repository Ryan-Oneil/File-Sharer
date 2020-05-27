import { GET_USER_STATS } from "../actions/types";

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
    default: {
      return { ...state };
    }
  }
};

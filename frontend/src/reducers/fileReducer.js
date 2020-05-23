import { DELETE_LINK, GET_SHARED_FILES } from "../actions/types";

export default (state = { activeFiles: [], expiredFiles: [] }, action) => {
  switch (action.type) {
    case GET_SHARED_FILES: {
      return {
        ...state,
        activeFiles: action.payload.activeLinks,
        expiredFiles: action.payload.expiredLinks
      };
    }
    case DELETE_LINK: {
      return {
        ...state,
        activeFiles: state.activeFiles.filter(
          link => link.id !== action.payload
        )
      };
    }
    default: {
      return { ...state };
    }
  }
};

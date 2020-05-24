import {
  ADD_FILES,
  DELETE_FILE,
  DELETE_LINK,
  GET_LINK_DETAILS,
  GET_SHARED_FILES
} from "../actions/types";

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
    case GET_LINK_DETAILS: {
      const linkFiles = state.activeFiles.filter(
        link => link.id !== action.payload.id
      );

      return {
        ...state,
        activeFiles: [...linkFiles, action.payload]
      };
    }
    case DELETE_FILE: {
      const updatedLink = state.activeFiles.find(
        link => link.id === action.linkID
      );
      const deletedFile = updatedLink.files.find(
        file => file.id === action.fileID
      );
      updatedLink.size -= deletedFile.size;

      updatedLink.files = updatedLink.files.filter(
        file => file.id !== action.fileID
      );

      const activeFiles = state.activeFiles.filter(
        link => link.id !== action.linkID
      );
      return { ...state, activeFiles: [...activeFiles, updatedLink] };
    }
    case ADD_FILES: {
      const updatedLink = state.activeFiles.find(
        link => link.id === action.linkID
      );
      const activeFiles = state.activeFiles.filter(
        link => link.id !== action.linkID
      );
      updatedLink.files = [...updatedLink.files, ...action.files];

      const newFilesSize = action.files.reduce((a, b) => a + b.size, 0);
      updatedLink.size += newFilesSize;

      return { ...state, activeFiles: [...activeFiles, updatedLink] };
    }
    default: {
      return { ...state };
    }
  }
};

import {
  ADD_FILES,
  DELETE_FILE,
  DELETE_LINK,
  EDIT_LINK,
  GET_LINK_DETAILS,
  GET_SHARED_FILES,
  GET_USER_LINK_COUNT,
  GET_USER_LINK_STATS,
  UPLOADER_ADD_FILE,
  UPLOADER_REMOVE_FILE,
  UPLOADER_RESET,
  UPLOADER_SET_LIMIT_REACHED
} from "../actions/types";

export default (
  state = {
    activeFiles: [],
    expiredFiles: [],
    stats: {
      totalViews: 0,
      totalLinks: 0,
      mostViewed: [],
      recentShared: []
    },
    linkUpload: {
      files: [],
      size: 0,
      reachedLimit: false
    }
  },
  action
) => {
  switch (action.type) {
    case GET_SHARED_FILES: {
      return {
        ...state,
        activeFiles: action.payload.links,
        stats: { ...state.stats, totalLinks: action.payload.total }
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
    case GET_USER_LINK_STATS: {
      return { ...state, stats: action.payload };
    }
    case EDIT_LINK: {
      const activeLinks = state.activeFiles.filter(
        link => link.id !== action.linkID
      );
      const updatedLink = state.activeFiles.find(
        link => link.id === action.linkID
      );
      updatedLink.title = action.link.title;
      updatedLink.expires = action.link.expires;

      return { ...state, activeFiles: [...activeLinks, updatedLink] };
    }
    case UPLOADER_ADD_FILE: {
      const newSize = state.linkUpload.size + action.file.size;
      return {
        ...state,
        linkUpload: {
          ...state.linkUpload,
          files: [...state.linkUpload.files, action.file],
          size: newSize
        }
      };
    }
    case UPLOADER_REMOVE_FILE: {
      const index = state.linkUpload.files.indexOf(action.file);
      const modifiedList = state.linkUpload.files.slice();
      modifiedList.splice(index, 1);

      const newSize = state.linkUpload.size - action.file.size;
      return {
        ...state,
        linkUpload: { size: newSize, files: modifiedList }
      };
    }
    case UPLOADER_SET_LIMIT_REACHED: {
      return {
        ...state,
        linkUpload: { ...state.linkUpload, reachedLimit: action.hasReach }
      };
    }
    case UPLOADER_RESET: {
      return {
        ...state,
        linkUpload: { size: 0, files: [], reachedLimit: false }
      };
    }
    case GET_USER_LINK_COUNT: {
      return {
        ...state,
        stats: { ...state.stats, totalLinks: action.payload }
      };
    }
    default: {
      return { ...state };
    }
  }
};

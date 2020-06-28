import {
  ADMIN_GET_RECENT_LINKS,
  GET_ADMIN_LINK_STATS,
  ADMIN_GET_POPULAR_LINKS,
  GET_SHARED_FILES_PAGEABLE,
  ADMIN_GET_TOTAL_QUOTA_USED,
  ADMIN_GET_USERS,
  ADMIN_GET_USER_LINKS,
  ADMIN_GET_USER_FILESHARE_STATS,
  ADMIN_GET_USER_DETAILS
} from "../actions/types";

export default (
  state = {
    totalUsed: 0,
    users: [],
    totalUsers: 0,
    fileShare: {
      totalViews: 0,
      totalLinks: 0,
      mostViewed: [],
      recentShared: [],
      activeFiles: []
    },
    user: {
      account: {
        name: "",
        email: "",
        role: "",
        enabled: "",
        quota: { used: 0, max: 0, ignoreQuota: false }
      },
      files: [],
      stats: { totalViews: 0, totalLinks: 0 }
    }
  },
  action
) => {
  switch (action.type) {
    case GET_ADMIN_LINK_STATS: {
      return {
        ...state,
        fileShare: { ...state.fileShare, ...action.payload }
      };
    }
    case GET_SHARED_FILES_PAGEABLE: {
      return {
        ...state,
        fileShare: { ...state.fileShare, activeFiles: action.payload }
      };
    }
    case ADMIN_GET_POPULAR_LINKS: {
      return {
        ...state,
        fileShare: { ...state.fileShare, mostViewed: action.payload }
      };
    }
    case ADMIN_GET_RECENT_LINKS: {
      return {
        ...state,
        fileShare: { ...state.fileShare, recentShared: action.payload }
      };
    }
    case ADMIN_GET_TOTAL_QUOTA_USED: {
      return { ...state, totalUsed: action.payload };
    }
    case ADMIN_GET_USERS: {
      return {
        ...state,
        users: action.payload.users,
        totalUsers: action.payload.total
      };
    }
    case ADMIN_GET_USER_LINKS: {
      return {
        ...state,
        user: {
          ...state.user,
          files: action.payload.links,
          totalLinks: action.payload.total
        }
      };
    }
    case ADMIN_GET_USER_FILESHARE_STATS: {
      return {
        ...state,
        user: {
          ...state.user,
          stats: { ...state.user.stats, ...action.payload }
        }
      };
    }
    case ADMIN_GET_USER_DETAILS: {
      return {
        ...state,
        user: { ...state.user, account: { ...action.payload } }
      };
    }
    default: {
      return { ...state };
    }
  }
};

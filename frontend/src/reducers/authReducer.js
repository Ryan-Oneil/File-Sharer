import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../actions/types";
import { decodeJWT, isTokenExpired } from "../actions";

export default function auth(
  state = {
    isAuthenticated: isAuth(),
    user: { name: decodeJWT("refreshToken").user, avatar: "" },
    role: decodeJWT("authToken").role
  },
  action
) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: { name: action.creds.username }
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        errorMessage: ""
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: ""
      });
    default:
      return state;
  }
}

const isAuth = () => {
  const token = decodeJWT("refreshToken");

  if (!token) {
    return false;
  }
  return !isTokenExpired(token);
};

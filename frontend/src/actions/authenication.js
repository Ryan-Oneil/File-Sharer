import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  NEW_PASSWORD_SENT,
  REGISTER_SUCCESS,
  RESET_PASSWORD_SENT
} from "./types";
import { apiPostCall, BASE_URL } from "../apis/api";

const requestLogin = creds => {
  return {
    type: LOGIN_REQUEST,
    isAuthenticated: false,
    creds
  };
};

const receiveLogin = token => {
  return {
    type: LOGIN_SUCCESS,
    isAuthenticated: true,
    token: token
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST,
    isAuthenticated: true
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS,
    isAuthenticated: false
  };
};

export const loginUser = creds => dispatch => {
  return apiPostCall(BASE_URL + "/login", creds).then(response => {
    dispatch(requestLogin(creds));
    const token = response.headers["authorization"];

    localStorage.setItem("refreshToken", token);
    dispatch(receiveLogin(token));
  });
};

export const registerUser = creds => dispatch => {
  return apiPostCall(BASE_URL + "/user/register", creds).then(response => {
    dispatch({ type: REGISTER_SUCCESS, message: response.data });
  });
};

export const logoutUser = () => {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    dispatch(receiveLogout());
  };
};

export const resetPassword = email => dispatch => {
  return apiPostCall(BASE_URL + "/user/forgotPassword/" + email).then(
    response => {
      dispatch({ type: RESET_PASSWORD_SENT, message: response.data });
    }
  );
};

export const changePassword = (token, password) => dispatch => {
  const options = {
    params: { password: password }
  };

  return apiPostCall(
    BASE_URL + "/user/newPassword/" + token,
    null,
    options
  ).then(response => {
    dispatch({ type: NEW_PASSWORD_SENT, message: response.data });
  });
};

export const isTokenExpired = token => {
  return Date.now() > token.exp * 1000;
};

export const decodeJWT = tokenType => {
  const token = localStorage.getItem(tokenType);

  if (!token) {
    return "";
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");

  return JSON.parse(window.atob(base64));
};

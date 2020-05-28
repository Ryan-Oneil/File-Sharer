import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS
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

export const registerUser = creds => {
  return apiPostCall(BASE_URL + "/user/register", creds);
};

export const logoutUser = () => {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    dispatch(receiveLogout());
  };
};

export const resetPassword = value => {
  return apiPostCall(BASE_URL + "/user/forgotPassword/" + value.email);
};

export const changePassword = (token, value) => {
  return apiPostCall(BASE_URL + "/user/newPassword/" + token, value);
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

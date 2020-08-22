import { combineReducers } from "redux";
import authReducer from "./authReducer";
import globalErrorReducer from "./globalErrorReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  globalErrors: globalErrorReducer,
  fileSharer: fileReducer,
  admin: adminReducer
});

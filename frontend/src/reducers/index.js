import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import globalErrorReducer from "./globalErrorReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  globalErrors: globalErrorReducer,
  user: userReducer,
  fileSharer: fileReducer,
  admin: adminReducer
});

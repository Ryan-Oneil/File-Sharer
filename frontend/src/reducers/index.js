import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import globalErrorReducer from "./globalErrorReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  globalErrors: globalErrorReducer,
  user: userReducer,
  fileSharer: fileReducer
});

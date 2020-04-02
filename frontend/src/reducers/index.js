import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import globalErrorReducer from "./globalErrorReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  globalErrors: globalErrorReducer
});

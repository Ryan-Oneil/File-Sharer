import React from "react";
import LoginForm from "../components/form/LoginForm";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const Login = props => {
  const history = useHistory();
  const { auth } = props;

  if (auth.isAuthenticated) {
    history.push("/dashboard");
  }

  return (
    <div className="login">
      <LoginForm />
    </div>
  );
};
const mapStateToProps = state => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Login);

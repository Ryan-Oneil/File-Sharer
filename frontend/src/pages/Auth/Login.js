import React from "react";
import LoginForm from "../../components/form/LoginForm";
import { Link } from "react-router-dom";
import { Button, Card, Divider } from "antd";
import { connect } from "react-redux";

const Login = props => {
  const { isAuthenticated } = props.auth;

  if (isAuthenticated) {
    props.history.push("/dashboard");
  }
  return (
    <div className="login">
      <Card>
        <LoginForm />
        <Divider>OR</Divider>
        <Link to="/register">
          <Button className="form-button">Sign Up</Button>
        </Link>
      </Card>
    </div>
  );
};
const mapStateToProps = state => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Login);

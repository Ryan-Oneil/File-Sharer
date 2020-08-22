import React from "react";
import LoginForm from "../../components/form/LoginForm";
import { Link } from "react-router-dom";
import { Button, Card, Divider } from "antd";
import { useSelector } from "react-redux";

export default props => {
  const { isAuthenticated } = useSelector(state => state.auth);

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

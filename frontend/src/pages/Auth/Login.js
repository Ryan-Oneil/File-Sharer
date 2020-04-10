import React from "react";
import LoginForm from "../../components/form/LoginForm";
import { Link } from "react-router-dom";
import { Button, Card, Divider } from "antd";

export default () => {
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

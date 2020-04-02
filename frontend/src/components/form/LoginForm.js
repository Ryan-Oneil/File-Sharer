import React from "react";
import { Field, Formik } from "formik";
import { InputWithErrors } from "./index";
import { Alert, Button } from "antd";
import { loginUser } from "../../actions";
import { connect } from "react-redux";
import { getApiError } from "../../helpers";
import { Link } from "react-router-dom";
import Icon from "antd/lib/icon";

const LoginForm = props => {
  const onSubmit = (formValues, { setStatus }) => {
    const creds = {
      username: formValues.username.trim(),
      password: formValues.password.trim()
    };
    return props.loginUser(creds).catch(error => {
      setStatus(getApiError(error));
    });
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      {props => {
        const {
          isSubmitting,
          handleSubmit,
          isValid,
          errors,
          status,
          setStatus
        } = props;

        return (
          <form onSubmit={handleSubmit} className="login-form">
            <Field
              name="username"
              as={InputWithErrors}
              type="text"
              placeholder="Username"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              error={errors.username}
            />
            <Field
              name="password"
              as={InputWithErrors}
              type="password"
              placeholder="Password"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              error={errors.password}
            />
            <Button
              type="primary"
              htmlType="submit"
              className="form-button"
              disabled={!isValid || isSubmitting}
              size="large"
            >
              Login
            </Button>
            Forgot Password? <Link to="/resetPassword">Reset password</Link>
            {status && (
              <Alert
                message="Login Error"
                description={status}
                type="error"
                closable
                showIcon
                onClose={() => setStatus("")}
              />
            )}
          </form>
        );
      }}
    </Formik>
  );
};

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = "Username is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
};
export default connect(null, { loginUser })(LoginForm);

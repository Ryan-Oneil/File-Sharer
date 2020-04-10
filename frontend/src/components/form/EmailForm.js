import React from "react";
import { Field, Formik } from "formik";
import { InputWithErrors } from "./index";
import { Alert, Button } from "antd";
import { resetPassword } from "../../actions";
import { connect } from "react-redux";
import { getApiError } from "../../helpers";

import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";

const EmailForm = props => {
  const onSubmit = (formValues, { setStatus }) => {
    return props.resetPassword(formValues.email.trim()).catch(error => {
      setStatus(getApiError(error));
    });
  };

  return (
    <Formik
      initialValues={{
        email: ""
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
          <form onSubmit={handleSubmit}>
            <Field
              name="email"
              as={InputWithErrors}
              type="email"
              placeholder="Email"
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              error={errors.email}
            />
            <Button
              type="primary"
              htmlType="submit"
              className="form-button"
              disabled={!isValid || isSubmitting}
              size="large"
            >
              Confirm
            </Button>
            {status && (
              <Alert
                message="Email Error"
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

  if (!values.email) {
    errors.email = "Email is required";
  }
  return errors;
};
export default connect(null, { resetPassword })(EmailForm);

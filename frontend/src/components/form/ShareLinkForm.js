import React, { useState } from "react";
import { Field, Formik } from "formik";
import { ErrorDisplay, InputWithErrors } from "./index";
import { Button, Card, DatePicker } from "antd";

export default props => {
  const {
    initialValues = {
      title: "",
      expires: "",
      password: ""
    }
  } = props;

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <Card>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validateOnMount
      >
        {props => {
          const {
            isSubmitting,
            handleSubmit,
            isValid,
            setFieldValue,
            touched
          } = props;

          const onDateChange = (date, dateString) => {
            setFieldValue("expires", dateString);
            touched.expires = true;
          };

          return (
            <form onSubmit={handleSubmit}>
              <Field
                name="title"
                as={InputWithErrors}
                type="text"
                placeholder="Link Title"
              />
              <Field
                name="password"
                as={InputWithErrors}
                type="text"
                placeholder="Link Password (optional)"
              />
              <DatePicker
                showTime={{ format: "HH:mm" }}
                onChange={onDateChange}
                style={{ width: "100%" }}
                placeholder="Link expiry date/time"
                size="large"
                disabledDate={current => {
                  return current && current.valueOf() < Date.now();
                }}
                showToday={false}
              />
              <ErrorDisplay name="expires" />
              <Button
                type="primary"
                htmlType="submit"
                className="form-button"
                disabled={!isValid || isSubmitting}
                style={{ marginTop: 24 }}
              >
                Confirm
              </Button>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};

const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = "Title is required";
  }
  if (Date.parse(values.expires) < Date.now()) {
    errors.expires = "Expiry date/time has already happened";
  }
  return errors;
};

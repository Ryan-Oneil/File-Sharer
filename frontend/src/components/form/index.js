import React from "react";
import { Input } from "antd";
import { ErrorMessage } from "formik";

export const InputWithErrors = props => {
  const hasError = props.error ? "has-error" : "";

  return (
    <div className="inputField">
      <Input {...props} size="large" className={hasError} />
      <ErrorDisplay name={props.name} />
    </div>
  );
};

export const ErrorDisplay = ({ name }) => {
  return (
    <ErrorMessage name={name} style={{ color: "#f5222d" }} component="span" />
  );
};

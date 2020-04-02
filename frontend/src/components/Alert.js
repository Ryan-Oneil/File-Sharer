import React from "react";
import { Alert } from "antd";

export const SuccessMessage = ({ message }) => {
  return <Alert message={message} type="success" />;
};

export const FailMessage = ({ message }) => {
  return <Alert message={message} type="error" />;
};

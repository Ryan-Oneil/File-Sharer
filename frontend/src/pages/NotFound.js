import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Result } from "antd";
export default () => {
  let location = useLocation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={`Sorry, ${location.pathname} does not exist.`}
      extra={<Button type="primary">Back Home</Button>}
    />
  );
};

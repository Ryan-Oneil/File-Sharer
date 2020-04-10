import React from "react";
import { Card } from "antd";
import ForgotPassword from "../../components/form/EmailForm";

export default () => {
  return (
    <div className="login">
      <Card>
        <ForgotPassword />
      </Card>
    </div>
  );
};

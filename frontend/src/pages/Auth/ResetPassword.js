import React from "react";
import { Card } from "antd";
import ForgotPassword from "../../components/form/EmailForm";
import { resetPassword } from "../../actions";

export default () => {
  return (
    <div className="login">
      <Card>
        <ForgotPassword action={resetPassword} />
      </Card>
    </div>
  );
};

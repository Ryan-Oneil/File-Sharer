import React from "react";
import { Card } from "antd";
import ForgotPassword from "../../components/form/EmailForm";
import { resetPassword } from "../../reducers/authReducer";
import { useDispatch } from "react-redux";

export default () => {
  const dispatch = useDispatch();

  return (
    <div className="login">
      <Card>
        <ForgotPassword action={() => dispatch(resetPassword())} />
      </Card>
    </div>
  );
};

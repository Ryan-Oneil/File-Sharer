import { Button, Modal } from "antd";
import React from "react";
import { connect } from "react-redux";
import { clearError, disableError } from "../actions/errors";

const ErrorModal = props => {
  const { message } = props;

  const closeModal = () => {
    props.clearError();
  };

  return (
    <Modal
      visible
      onCancel={closeModal}
      onOk={closeModal}
      title="An Error Occurred"
      footer={[
        <Button key="disable" onClick={() => props.disableError()}>
          Disable
        </Button>,
        <Button key="confirm" type="primary" onClick={() => props.clearError()}>
          Ok
        </Button>
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};
export default connect(null, { clearError, disableError })(ErrorModal);

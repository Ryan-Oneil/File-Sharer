import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, Dropdown, Menu, Modal, Row } from "antd";
import ChangePasswordForm from "../components/form/ChangePasswordForm";
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined";
import EmailForm from "../components/form/EmailForm";

const Profile = props => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { name, email } = props.user.details;

  const actions = (
    <Menu>
      <Menu.Item key="0">
        <Button type="link" onClick={() => setShowPasswordForm(true)}>
          Change Password
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button type="link" onClick={() => setShowEmailForm(true)}>
          Change Email
        </Button>
      </Menu.Item>
    </Menu>
  );

  const passwordModal = () => {
    return (
      <Modal
        title="Change Password"
        visible={showPasswordForm}
        onCancel={() => setShowPasswordForm(false)}
        footer={null}
      >
        <ChangePasswordForm />
      </Modal>
    );
  };

  const emailModal = () => {
    return (
      <Modal
        title="Change Email"
        visible={showEmailForm}
        onCancel={() => setShowEmailForm(false)}
        footer={null}
      >
        <EmailForm />
      </Modal>
    );
  };

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <Card
            title="Account Details"
            extra={
              <Dropdown overlay={actions} trigger={["click"]}>
                <SettingOutlined />
              </Dropdown>
            }
          >
            <p>Email: {email}</p>
            <p>Username: {name} </p>
          </Card>
        </Col>
      </Row>
      {showPasswordForm && passwordModal()}
      {showEmailForm && emailModal()}
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Profile);

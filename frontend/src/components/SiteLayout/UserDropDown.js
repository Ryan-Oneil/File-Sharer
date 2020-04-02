import React from "react";
import { Avatar, Dropdown, Menu, Spin } from "antd";
import { connect } from "react-redux";
import Icon from "antd/lib/icon";

const dropdown = props => {
  const { user } = props.auth;

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={null}>
      <Menu.Item key="center">
        <Icon type="user" />
        Account
      </Menu.Item>
      <Menu.Item key="settings">
        <Icon type="setting" />
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        Logout
      </Menu.Item>
    </Menu>
  );

  return user && user.name ? (
    <Dropdown overlay={menuHeaderDropdown}>
      <span className="right userDropdown">
        <Avatar
          size="small"
          className="avatar"
          src={user.avatar}
          alt="avatar"
        />
        <span>{user.name}</span>
      </span>
    </Dropdown>
  ) : (
    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
export default connect(mapStateToProps)(dropdown);

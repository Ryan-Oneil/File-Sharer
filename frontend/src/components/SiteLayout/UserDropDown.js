import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions";

const dropdown = props => {
  const { user } = props.auth;

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={null}>
      <Menu.Item key="center">
        <Link to="/dashboard/profile">
          <UserOutlined />
          Account
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => props.logoutUser()}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <span className="right userDropdown">
        <Avatar
          size="small"
          className="avatar"
          src={user.avatar}
          alt="avatar"
        />
        <span className="username">{user.name}</span>
      </span>
    </Dropdown>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
export default connect(mapStateToProps, { logoutUser })(dropdown);

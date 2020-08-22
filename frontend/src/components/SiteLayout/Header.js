import React from "react";
import { Layout, Menu } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import LoginOutlined from "@ant-design/icons/lib/icons/LoginOutlined";
import UserDropDown from "./UserDropDown";

const { Header } = Layout;
const NavHeader = props => {
  const { isAuthenticated, role } = props.auth;
  const isAdmin = role === "ROLE_ADMIN";

  return (
    <Header className="whiteBackground">
      <Menu mode="horizontal">
        <Menu.Item key="/dashboard">
          <NavLink to="/dashboard" exact>
            Dashboard
          </NavLink>
        </Menu.Item>
        {isAdmin && (
          <Menu.Item key="/admin">
            <NavLink to="/admin" exact>
              Admin
            </NavLink>
          </Menu.Item>
        )}
        {!isAuthenticated && (
          <Menu.Item key="/login" className="right">
            <NavLink to="/login" exact>
              <LoginOutlined />
              Login
            </NavLink>
          </Menu.Item>
        )}
        {isAuthenticated && <UserDropDown />}
      </Menu>
    </Header>
  );
};
const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(NavHeader);

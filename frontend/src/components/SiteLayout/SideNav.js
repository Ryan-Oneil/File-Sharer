import React from "react";
import { Menu } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import FileOutlined from "@ant-design/icons/lib/icons/FileOutlined";
import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined";
import DashboardOutlined from "@ant-design/icons/lib/icons/DashboardOutlined";

const SideNav = ({ path, location }) => {
  return (
    <div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/dashboard">
          <NavLink to={path} exact>
            <DashboardOutlined />
            <span>Overview</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${path}/share`}>
          <NavLink to={`${path}/share`} exact>
            <ShareAltOutlined />
            <span>Share File</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${path}/files`}>
          <NavLink to={`${path}/files`} exact>
            <FileOutlined />
            <span>Files</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </div>
  );
};
export default withRouter(SideNav);

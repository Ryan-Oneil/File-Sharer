import React from "react";
import { Menu } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import FileOutlined from "@ant-design/icons/lib/icons/FileOutlined";
import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined";
import DashboardOutlined from "@ant-design/icons/lib/icons/DashboardOutlined";

const SideNav = ({ path, location }) => {
  return (
    <div>
      <div className="appName">File Sharer</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/dashboard">
          <NavLink to={path} exact>
            <DashboardOutlined />
            Overview
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${path}/share`}>
          <NavLink to={`${path}/share`} exact>
            <ShareAltOutlined />
            Share File
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${path}/files`}>
          <NavLink to={`${path}/files`} exact>
            <FileOutlined />
            Files
          </NavLink>
        </Menu.Item>
      </Menu>
    </div>
  );
};
export default withRouter(SideNav);

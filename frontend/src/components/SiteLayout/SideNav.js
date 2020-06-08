import React from "react";
import { Menu } from "antd";
import { NavLink, withRouter } from "react-router-dom";

const SideNav = ({ path, location, links = [] }) => {
  const renderLinks = () => {
    return links.map(link => {
      return (
        <Menu.Item key={`${path}${link.path}`}>
          <NavLink to={`${path}${link.path}`} exact>
            {link.icon}
            {link.name}
          </NavLink>
        </Menu.Item>
      );
    });
  };

  return (
    <div>
      <div className="appName">File Sharer</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
      >
        {renderLinks()}
      </Menu>
    </div>
  );
};
export default withRouter(SideNav);

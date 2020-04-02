import React from "react";
import SubMenu from "antd/es/menu/SubMenu";

export default ({ children, title }) => {
  return <SubMenu title={title}>{children}</SubMenu>;
};

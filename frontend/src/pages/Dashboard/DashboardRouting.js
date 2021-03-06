import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import { connect } from "react-redux";
import SideNav from "../../components/SiteLayout/SideNav";
import { Layout } from "antd";
import Overview from "./Overview";
import UploadPage from "../FileShare/UploadPage";
import ManageFilesPage from "../FileShare/ManageFilesPage";
import NavHeader from "../../components/SiteLayout/Header";
import Profile from "../Profile";
import EditLinkPage from "../FileShare/EditLinkPage";
import DashboardOutlined from "@ant-design/icons/lib/icons/DashboardOutlined";
import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined";
import FileOutlined from "@ant-design/icons/lib/icons/FileOutlined";

class DashboardRouting extends React.Component {
  render() {
    const { match } = this.props;
    const { Sider, Content } = Layout;
    const dashBoardLinks = [
      { path: "", icon: <DashboardOutlined />, name: "Overview" },
      { path: "/share", icon: <ShareAltOutlined />, name: "Share File" },
      { path: "/files", icon: <FileOutlined />, name: "Files" }
    ];

    return (
      <Layout style={{ height: "100vh" }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <SideNav path={match.path} links={dashBoardLinks} />
        </Sider>
        <Layout>
          <NavHeader />
          <Content className="mainContent">
            <Switch>
              <PrivateRoute>
                <Route exact path={match.path} component={Overview} />
                <Route
                  exact
                  path={`${match.path}/share`}
                  component={UploadPage}
                />
                <Route
                  exact
                  path={`${match.path}/files`}
                  component={ManageFilesPage}
                />
                <Route
                  exact
                  path={`${match.path}/files/edit/:linkID`}
                  component={EditLinkPage}
                />
                <Route
                  exact
                  path={`${match.path}/profile`}
                  component={Profile}
                />
              </PrivateRoute>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(DashboardRouting);

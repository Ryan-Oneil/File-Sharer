import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import { connect } from "react-redux";
import SideNav from "../../components/SiteLayout/SideNav";
import { Layout } from "antd";
import UserDropDown from "../../components/SiteLayout/UserDropDown";
import Overview from "./Overview";
import UploadPage from "../FileShare/UploadPage";
import Icon from "antd/lib/icon";
import ManageFilesPage from "../FileShare/ManageFilesPage";

class ProfileRouting extends React.Component {
  state = { collapsed: false };

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const { match } = this.props;
    const { Header, Sider, Content } = Layout;

    return (
      <Layout style={{ height: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <SideNav path={match.path} />
        </Sider>
        <Layout>
          <Header className="iconHeader">
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <UserDropDown />
          </Header>
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
export default connect(mapStateToProps)(ProfileRouting);

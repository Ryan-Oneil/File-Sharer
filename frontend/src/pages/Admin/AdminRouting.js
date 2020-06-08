import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import { connect } from "react-redux";
import SideNav from "../../components/SiteLayout/SideNav";
import { Layout } from "antd";
import Overview from "./Overview";
import NavHeader from "../../components/SiteLayout/Header";
import DashboardOutlined from "@ant-design/icons/lib/icons/DashboardOutlined";

class AdminRouting extends React.Component {
  render() {
    const { match } = this.props;
    const { Sider, Content } = Layout;
    const adminLinks = [
      { path: "/stats", icon: <DashboardOutlined />, name: "Stats" }
    ];

    return (
      <Layout style={{ height: "100vh" }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <SideNav path={match.path} links={adminLinks} />
        </Sider>
        <Layout>
          <NavHeader />
          <Content className="mainContent">
            <Switch>
              <PrivateRoute>
                <Route exact path={match.path} component={Overview} />
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
export default connect(mapStateToProps)(AdminRouting);

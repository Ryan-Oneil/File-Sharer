import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, Card, Col, Row, Tabs } from "antd";
import { Link } from "react-router-dom";
import EditUserForm from "../../components/form/EditUserForm";
import { displayBytesInReadableForm } from "../../helpers";
import StatisticCard from "../../components/Stats/StatisticCard";
import {
  adminGetUserDetails,
  getUserFileStats
} from "../../reducers/adminReducer";
import { getUserLinks } from "../../reducers/fileReducer";
import SharedLinkTable from "../../components/Tables/SharedLinkTable";
const { TabPane } = Tabs;

export default props => {
  const dispatch = useDispatch();
  const { match } = props;
  const { user } = props.match.params;
  const adminUserState = useSelector(state => state.admin.user);
  const { users } = useSelector(state => state.admin);
  const account = users[user] || {
    name: "",
    email: "",
    role: "",
    enabled: "",
    quota: { used: 0, max: 0, ignoreQuota: false }
  };
  const { totalLinks, totalViews } = adminUserState.stats;
  const [loadingFileStats, setLoadingFileStats] = useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);

  const loadUserStats = () => {
    dispatch(getUserFileStats(user)).then(() => setLoadingFileStats(false));
    dispatch(adminGetUserDetails(user)).then(() =>
      setLoadingUserDetails(false)
    );
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/users">Manage Users</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{user}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Account Settings" key="1">
            <Row gutter={[32, 32]} type="flex">
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <EditUserForm user={account} loading={loadingUserDetails} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Files" key="2">
            <SharedLinkTable
              editPath={match.path}
              fetchData={(page, size, sorter) =>
                getUserLinks(user, page, size, sorter)
              }
            />
          </TabPane>
          <TabPane tab="Stats" key="3">
            <Row gutter={[32, 32]} type="flex" justify="center">
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Links"}
                  value={totalLinks}
                  loading={loadingFileStats}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Link Views"}
                  value={totalViews}
                  loading={loadingFileStats}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Used Storage"}
                  value={displayBytesInReadableForm(account.quota.used)}
                  loading={loadingUserDetails}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Usable Storage"}
                  value={`${account.quota.max} GB`}
                  loading={loadingUserDetails}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

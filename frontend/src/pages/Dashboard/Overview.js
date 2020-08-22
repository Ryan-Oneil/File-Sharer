import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Avatar, Col, List, Row } from "antd";

import StatisticCard from "../../components/Stats/StatisticCard";
import ListCard from "../../components/Stats/ListCard";
import { displayBytesInReadableForm } from "../../helpers";
import { getQuotaStats } from "../../reducers/userReducer";
import { getUserLinkStats } from "../../reducers/fileReducer";

const Overview = props => {
  const {
    totalViews,
    totalLinks,
    mostViewedLinks,
    recentLinks
  } = props.fileSharer.stats;
  const dispatch = useDispatch();
  const [loadingData, setLoadingData] = useState(true);
  const { used, max } = props.user.storageQuota;

  useEffect(() => {
    const { name } = props.auth.user;

    dispatch(getUserLinkStats(name)).then(() => setLoadingData(false));
    dispatch(getQuotaStats(name));
  }, []);
  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Shared Links" value={totalLinks} />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard
            title="Used Storage Space"
            value={displayBytesInReadableForm(used)}
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Storage Space" value={max} suffix="GB" />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Views" value={totalViews} />
        </Col>
      </Row>
      <Row gutter={[32, 32]} type="flex">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <ListCard
            title="Most Viewed Links"
            itemLayout="horizontal"
            loading={loadingData}
            dataSource={mostViewedLinks}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={require("../../assets/images/file.png")}
                      size="large"
                    />
                  }
                  title={
                    <a
                      href={`/shared/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title ? item.title : item.id}
                    </a>
                  }
                  description={`${item.views} views`}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <ListCard
            title="Recent Links"
            itemLayout="horizontal"
            loading={loadingData}
            dataSource={recentLinks}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={require("../../assets/images/file.png")}
                      size="large"
                    />
                  }
                  title={
                    <a
                      href={`/shared/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title ? item.title : item.id}
                    </a>
                  }
                  description={`${item.views} views`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
const mapStateToProps = state => {
  return { auth: state.auth, fileSharer: state.fileSharer, user: state.user };
};
export default connect(mapStateToProps)(Overview);

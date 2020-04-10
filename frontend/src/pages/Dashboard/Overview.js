import React from "react";
import { connect } from "react-redux";
import { Avatar, Col, List, Row } from "antd";

import StatisticCard from "../../components/Stats/StatisticCard";
import ListCard from "../../components/Stats/ListCard";
import { displayBytesInReadableForm } from "../../helpers";

const Overview = props => {
  const {
    totalViews,
    totalShared,
    mostViewed,
    recentShared
  } = props.user.fileShareStats;

  const { used, max } = props.user.storageQuota;

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Shared Files" value={totalShared} />
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
            title="Most Viewed Files"
            itemLayout="horizontal"
            dataSource={mostViewed}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={require("../../assets/images/file.png")}
                      size="large"
                    />
                  }
                  title={<a href="https://ant.design">{item.title}</a>}
                  description={`${item.views} views`}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <ListCard
            title="Recent Files"
            itemLayout="horizontal"
            dataSource={recentShared}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={require("../../assets/images/file.png")}
                      size="large"
                    />
                  }
                  title={<a href="https://ant.design">{item.title}</a>}
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
  return { user: state.user };
};
export default connect(mapStateToProps)(Overview);

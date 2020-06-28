import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Col, List, Row } from "antd";

import StatisticCard from "../../components/Stats/StatisticCard";
import ListCard from "../../components/Stats/ListCard";
import { displayBytesInReadableForm } from "../../helpers";
import {
  getAdminLinkStats,
  getPopularLinksPageable,
  getRecentLinks
} from "../../actions/fileshare";
import { getUsedStorage } from "../../actions/user";

const Overview = props => {
  const {
    totalViews,
    totalLinks,
    mostViewed,
    recentShared
  } = props.admin.fileShare;

  const [recentLinksLoading, setRecentLinksLoading] = useState(true);
  const [popularLinksLoading, setPopularLinksLoading] = useState(true);
  const { totalUsed } = props.admin;

  useEffect(() => {
    props.getAdminLinkStats();
    props.getUsedStorage();
    props.getRecentLinks(5).then(() => setRecentLinksLoading(false));
    props
      .getPopularLinksPageable(0, 5, "views,desc")
      .then(() => setPopularLinksLoading(false));
  }, []);

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Shared Links" value={totalLinks} />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Total Views" value={totalViews} />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard
            title="Used Storage"
            value={displayBytesInReadableForm(totalUsed)}
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <StatisticCard title="Available Storage" value={totalViews} />
        </Col>
      </Row>
      <Row gutter={[32, 32]} type="flex">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <ListCard
            title="Popular Links"
            itemLayout="horizontal"
            dataSource={mostViewed}
            loading={popularLinksLoading}
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
            dataSource={recentShared}
            loading={recentLinksLoading}
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
  return { admin: state.admin };
};
export default connect(mapStateToProps, {
  getAdminLinkStats,
  getUsedStorage,
  getRecentLinks,
  getPopularLinksPageable
})(Overview);

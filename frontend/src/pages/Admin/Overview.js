import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Col, List, Row } from "antd";
import StatisticCard from "../../components/Stats/StatisticCard";
import ListCard from "../../components/Stats/ListCard";
import { displayBytesInReadableForm } from "../../helpers";
import { getAdminLinkStats, getUsedStorage } from "../../reducers/adminReducer";

export default () => {
  const { admin } = useSelector(state => state);
  const { totalViews, totalLinks, mostViewed, recentShared } = admin.fileShare;
  const dispatch = useDispatch();
  const [loadingData, setLoadingData] = useState(true);
  const { totalUsed } = admin;

  useEffect(() => {
    dispatch(getAdminLinkStats()).then(() => setLoadingData(false));
    dispatch(getUsedStorage());
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
            loading={loadingData}
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
            loading={loadingData}
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

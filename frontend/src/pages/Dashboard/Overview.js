import React from "react";
import { connect } from "react-redux";
import { Avatar, Col, List, Row } from "antd";

import StatisticCard from "../../components/Stats/StatisticCard";
import ListCard from "../../components/Stats/ListCard";

const Overview = props => {
  const data = [
    {
      title: "Hello.jpg",
      views: 60
    },
    {
      title: "Tom.png",
      views: 200
    }
  ];

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col span={6}>
          <StatisticCard title="Total Shared Files" value={200} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Used Storage Space" value={200} suffix="GB" />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Remaing Storage Space"
            value={200}
            suffix="GB"
          />
        </Col>
        <Col span={6}>
          <StatisticCard title="Total Views" value={3000} />
        </Col>
      </Row>
      <Row gutter={[32, 32]} type="flex">
        <Col span={12}>
          <ListCard
            title="Most Viewed Files"
            itemLayout="horizontal"
            dataSource={data}
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
        <Col span={12}>
          <ListCard
            title="Recent Files"
            itemLayout="horizontal"
            dataSource={data}
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
  return { teamspeak: state.teamspeak };
};
export default connect(mapStateToProps)(Overview);

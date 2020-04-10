import React from "react";
import { Avatar, Button, Card, Col, List, Row, Statistic, Tooltip } from "antd";
import { displayBytesInReadableForm } from "../../helpers";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";

export default props => {
  const { id } = props.match.params;

  const sampleData = [
    {
      title: "Hello.jpg",
      size: "2390994",
      id: "adw23"
    },
    {
      title: "Test.txt",
      size: "54321",
      id: "wa1"
    },
    {
      title: "Bans.docx",
      size: "234390994",
      id: "dwaf3"
    },
    {
      title: "IA.txt",
      size: "23920994",
      id: "sdfe"
    },
    {
      title: "AllImages.zip",
      size: "2390912394",
      id: "tyrr"
    }
  ];

  return (
    <Row style={{ padding: "2%" }}>
      <Col span={6}>
        <Card title="Sample Link Title">
          <Statistic title="Views" value={36} />
          <Statistic title="Files" value={5} />
          <Statistic
            title="Size"
            value={displayBytesInReadableForm(29372104789)}
          />
        </Card>
      </Col>
      <Col span={17} offset={1}>
        <Card>
          <List
            pagination
            dataSource={sampleData}
            renderItem={item => (
              <List.Item
                actions={[
                  <Tooltip title="Download">
                    <Button
                      shape="circle"
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        window.open("https://www.google.com", "_blank");
                      }}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={require("../../assets/images/file.png")} />
                  }
                  title={item.title}
                  description={`Size ${displayBytesInReadableForm(item.size)}`}
                />
              </List.Item>
            )}
            footer={
              <Tooltip title="Download">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    window.open("https://www.google.com", "_blank");
                  }}
                >
                  Download All
                </Button>
              </Tooltip>
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, List, Row, Statistic, Tooltip } from "antd";
import { displayBytesInReadableForm, getApiError } from "../../helpers";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { apiGetCall, BASE_URL } from "../../apis/api";
import { connect } from "react-redux";
import { setError } from "../../actions/errors";

const Page = props => {
  const [link, setLink] = useState({
    title: "",
    id: "",
    views: 0,
    expiryDatetime: "",
    size: 0,
    files: []
  });
  const { id } = props.match.params;

  const getLinkDetails = () => {
    apiGetCall(`/info/${id}`)
      .then(response => {
        setLink(response.data);
        setError("");
      })
      .catch(error => props.setError(getApiError(error)));
  };

  useEffect(() => {
    getLinkDetails();
  }, []);

  return (
    <Row style={{ padding: "2%" }}>
      <Col span={6}>
        <Card title={link.title}>
          <Statistic title="Views" value={link.views} />
          <Statistic title="Files" value={link.files.length} />
          <Statistic
            title="Size"
            value={displayBytesInReadableForm(link.size)}
          />
        </Card>
      </Col>
      <Col span={17} offset={1}>
        <Card>
          <List
            pagination
            dataSource={link.files}
            renderItem={item => (
              <List.Item
                actions={[
                  <Tooltip title="Download">
                    <Button
                      shape="circle"
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        window.open(`${BASE_URL}/file/dl/${item.id}`, "_blank");
                      }}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={require("../../assets/images/file.png")} />
                  }
                  title={item.name}
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
                    window.open(`${BASE_URL}/download/${id}`, "_blank");
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
export default connect(null, { setError })(Page);

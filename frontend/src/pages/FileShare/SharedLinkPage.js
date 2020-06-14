import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Result,
  Row,
  Statistic,
  Tooltip
} from "antd";
import { displayBytesInReadableForm, getApiError } from "../../helpers";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { apiGetCall, BASE_URL } from "../../apis/api";
import { connect } from "react-redux";
import { setError } from "../../actions/errors";
import ListCard from "../../components/Stats/ListCard";

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
  const [loadingData, setLoadingData] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);

  const getLinkDetails = () => {
    apiGetCall(`/info/${id}`)
      .then(response => {
        setLink(response.data);
        setError("");
        setLoadingData(false);
      })
      .catch(error => {
        console.log(error.response.status);
        if (error.response && error.response.status === 404) {
          setInvalidLink(true);
        } else {
          props.setError(getApiError(error));
        }
      });
  };

  useEffect(() => {
    getLinkDetails();
  }, []);

  return (
    <>
      {!invalidLink && (
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
            <ListCard
              title="Files"
              pagination
              dataSource={link.files}
              loading={loadingData}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Tooltip title="Download">
                      <Button
                        shape="circle"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          window.open(
                            `${BASE_URL}/file/dl/${item.id}`,
                            "_blank"
                          );
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
                    description={`Size ${displayBytesInReadableForm(
                      item.size
                    )}`}
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
                    disabled={link.files.length < 1}
                  >
                    Download All
                  </Button>
                </Tooltip>
              }
            />
          </Col>
        </Row>
      )}
      {invalidLink && (
        <Result status="warning" title="This shared link doesn't exist" />
      )}
    </>
  );
};
export default connect(null, { setError })(Page);

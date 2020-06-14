import React from "react";
import { Avatar, Button, Card, Col, List, Row } from "antd";
import StatisticCard from "../../components/Stats/StatisticCard";
import { displayBytesInReadableForm } from "../../helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Uploader from "../../components/Uploader";
import { connect } from "react-redux";
import { uploaderRemoveFile } from "../../actions/fileshare";
import ShareLinkForm from "../../components/form/ShareLinkForm";

const UploadPage = props => {
  const { size, files } = props.fileSharer.linkUpload;
  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <ShareLinkForm />
        </Col>
        <Col span={16}>
          <Uploader showUploadList={false} />
        </Col>
      </Row>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <StatisticCard
            title={"Total Size"}
            value={displayBytesInReadableForm(size)}
          />
        </Col>
        <Col span={16}>
          <Card>
            <List
              dataSource={files}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button
                      danger
                      type="primary"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        props.uploaderRemoveFile(item);
                      }}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={require("../../assets/images/file.png")} />
                    }
                    title={item.name}
                    description={displayBytesInReadableForm(item.size)}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
const mapStateToProp = state => {
  return { fileSharer: state.fileSharer };
};

export default connect(mapStateToProp, { uploaderRemoveFile })(UploadPage);

import React, { useState } from "react";
import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import Dragger from "antd/lib/upload/Dragger";
import { Avatar, Button, Card, Col, List, Row } from "antd";
import ShareLinkForm from "../../components/form/ShareLinkForm";
import StatisticCard from "../../components/Stats/StatisticCard";
import { displayBytesInReadableForm } from "../../helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

export default props => {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const config = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: file => {
      setFiles(prevState => [...prevState, file]);
      setTotalSize(prevState => prevState + file.size);
      return false;
    }
  };

  const removeFile = file => {
    const index = files.indexOf(file);
    const modifiedList = files.slice();

    modifiedList.splice(index, 1);
    setFiles(modifiedList);
    setTotalSize(prevState => prevState - file.size);
  };

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <ShareLinkForm />
        </Col>
        <Col span={16}>
          <Dragger {...config}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p>Click or drag file to this area to upload</p>
          </Dragger>
        </Col>
      </Row>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <StatisticCard
            title={"Total Size"}
            value={displayBytesInReadableForm(totalSize)}
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
                      onClick={() => removeFile(item)}
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

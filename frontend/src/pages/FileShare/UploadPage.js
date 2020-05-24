import React, { useState } from "react";
import { Avatar, Button, Card, Col, List, Row } from "antd";
import StatisticCard from "../../components/Stats/StatisticCard";
import { displayBytesInReadableForm } from "../../helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { ShareLinkForm } from "../../components/form/ShareLinkForm";
import Uploader from "../../components/Uploader";

export default props => {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const removeFile = file => {
    const index = files.indexOf(file);
    const modifiedList = files.slice();

    modifiedList.splice(index, 1);
    setFiles(modifiedList);
    setTotalSize(prevState => prevState - file.size);
  };

  const resetFiles = () => {
    setFiles([]);
    setTotalSize(0);
  };

  return (
    <>
      <Row gutter={[32, 32]} type="flex">
        <Col span={8}>
          <ShareLinkForm files={files} resetFiles={resetFiles} />
        </Col>
        <Col span={16}>
          <Uploader
            setFiles={setFiles}
            setTotalSize={setTotalSize}
            showUploadList={false}
            files={files}
          />
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

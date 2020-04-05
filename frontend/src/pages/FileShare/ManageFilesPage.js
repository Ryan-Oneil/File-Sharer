import React, { useState } from "react";
import { Avatar, Button, Card, List, Modal, Tabs, Tooltip } from "antd";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { displayBytesInReadableForm } from "../../helpers";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import ShareLinkForm from "../../components/form/ShareLinkForm";
const { TabPane } = Tabs;

export default props => {
  const [editLink, setEditLink] = useState("");

  const sampleData = [
    {
      title: "Link 1",
      views: "27",
      size: "2390994",
      id: "adw23",
      password: "test"
    },
    {
      title: "Link 2",
      views: "5",
      size: "54321",
      id: "wa1"
    },
    {
      title: "Link 3",
      views: "66",
      size: "234390994",
      id: "dwaf3"
    },
    {
      title: "Link 4",
      views: "85",
      size: "23920994",
      id: "sdfe"
    },
    {
      title: "Link 5",
      views: "12",
      size: "2390912394",
      id: "tyrr"
    }
  ];

  const activeLinkList = () => {
    return (
      <List
        pagination
        dataSource={sampleData}
        renderItem={item => (
          <List.Item
            actions={[
              <Tooltip title="View">
                <Button
                  shape="circle"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    window.open("https://www.google.com", "_blank");
                  }}
                />
              </Tooltip>,
              <Tooltip title="Download">
                <Button
                  shape="circle"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    window.open("https://www.google.com", "_blank");
                  }}
                />
              </Tooltip>,
              <Tooltip title="Edit">
                <Button
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => setEditLink(item)}
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Button
                  danger
                  type="primary"
                  shape="circle"
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={require("../../assets/images/file.png")} />}
              title={item.title}
              description={`Size ${displayBytesInReadableForm(item.size)} - ${
                item.views
              } views`}
            />
          </List.Item>
        )}
      />
    );
  };

  const expiredLinkList = () => {
    return (
      <List
        pagination
        dataSource={sampleData}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={require("../../assets/images/file.png")} />}
              title={item.title}
              description={`Size ${displayBytesInReadableForm(item.size)} - ${
                item.views
              } views`}
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Active" key="1" style={{ outline: "none" }}>
            {activeLinkList()}
          </TabPane>
          <TabPane tab="Expired" key="2" style={{ outline: "none" }}>
            {expiredLinkList()}
          </TabPane>
        </Tabs>
      </Card>
      {editLink && (
        <Modal
          title="Edit Shared Link"
          visible={editLink}
          onCancel={() => setEditLink("")}
          footer={null}
        >
          <ShareLinkForm
            initialValues={{
              title: editLink.title,
              password: editLink.password,
              expires: editLink.expires
            }}
          />
        </Modal>
      )}
    </>
  );
};

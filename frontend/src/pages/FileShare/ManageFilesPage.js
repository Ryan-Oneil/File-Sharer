import React, { useState, useEffect } from "react";
import { Avatar, Button, Card, List, Modal, Tabs, Tooltip } from "antd";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { displayBytesInReadableForm } from "../../helpers";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteLink, getUserFiles } from "../../actions/fileshare";
import { BASE_URL } from "../../apis/api";
import { ShareLinkForm } from "../../components/form/ShareLinkForm";
const { TabPane } = Tabs;

const ManageFilePage = props => {
  const [editLink, setEditLink] = useState("");
  const { activeFiles, expiredFiles } = props.fileSharer;

  useEffect(() => {
    const { user } = props.auth;

    props.getUserFiles(user.name);
  }, []);

  const activeLinkList = () => {
    return (
      <List
        pagination
        dataSource={activeFiles}
        renderItem={item => (
          <List.Item
            actions={[
              <Tooltip title="View">
                <Link to={`/shared/${item.id}`}>
                  <Button shape="circle" icon={<EyeOutlined />} />
                </Link>
              </Tooltip>,
              <Tooltip title="Download">
                <Button
                  shape="circle"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    window.open(`${BASE_URL}/download/${item.id}`, "_blank");
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
                  onClick={() => props.deleteLink(item.id)}
                />
              </Tooltip>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={require("../../assets/images/file.png")} />}
              title={item.id}
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
        dataSource={expiredFiles}
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
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer, auth: state.auth };
};
export default connect(mapStateToProps, { getUserFiles, deleteLink })(
  ManageFilePage
);

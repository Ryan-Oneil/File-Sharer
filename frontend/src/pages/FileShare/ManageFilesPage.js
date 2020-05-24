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
import ConfirmButton from "../../components/ConfirmButton";
const { TabPane } = Tabs;

const ManageFilePage = props => {
  const { activeFiles, expiredFiles } = props.fileSharer;
  const { match } = props;

  useEffect(() => {
    const { user } = props.auth;

    props.getUserFiles(user.name);
  }, []);

  const activeLinkList = () => {
    return (
      <List
        pagination
        dataSource={activeFiles}
        size="small"
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
                <Link to={`${match.path}/edit/${item.id}`}>
                  <Button shape="circle" icon={<EditOutlined />} />
                </Link>
              </Tooltip>,
              <ConfirmButton
                toolTip="Delete"
                buttonIcon={<DeleteOutlined />}
                confirmAction={() => props.deleteLink(item.id)}
                modalTitle="Do you want to delete this link?"
                modalDescription="All files will also be deleted"
              />
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={require("../../assets/images/file.png")} />}
              title={item.title ? item.title : item.id}
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
        size="small"
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
  );
};
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer, auth: state.auth };
};
export default connect(mapStateToProps, { getUserFiles, deleteLink })(
  ManageFilePage
);

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  List,
  Modal,
  Row,
  Statistic,
  Tooltip
} from "antd";
import { displayBytesInReadableForm } from "../../helpers";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { BASE_URL } from "../../apis/api";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  addFiles,
  deleteFile,
  deleteLink,
  editLink,
  getLinkDetails,
  resetUploader
} from "../../actions/fileshare";
import { EditLinkForm } from "../../components/form/EditLinkForm";
import FileAddOutlined from "@ant-design/icons/lib/icons/FileAddOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import ConfirmButton from "../../components/ConfirmButton";
import Uploader from "../../components/Uploader";

const EditLinkPage = props => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { files } = props.fileSharer.linkUpload;
  const { linkID } = props.match.params;
  const { activeFiles } = props.fileSharer;

  useEffect(() => {
    props.getLinkDetails(linkID);
  }, []);
  const link = activeFiles.find(link => link.id === linkID);

  const deleteLinkAction = () => {
    props.deleteLink(linkID);
    props.history.goBack();
  };

  const deleteFileAction = fileID => {
    props.deleteFile(fileID, linkID);
  };

  const resetFiles = () => {
    props.resetUploader();
  };

  const uploadNewFiles = () => {
    setUploading(true);
    props.addFiles(files, linkID).then(() => {
      resetFiles();
      setUploading(false);
      setShowUploadModal(false);
    });
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={"/dashboard/files"}>Files</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit</Breadcrumb.Item>
      </Breadcrumb>
      {link && (
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

            <Card style={{ marginTop: "2%" }} title={"Edit Link"}>
              <EditLinkForm
                submitAction={props.editLink}
                id={linkID}
                link={link}
              />
            </Card>
          </Col>
          <Col span={17} offset={1}>
            <Card>
              <List
                pagination
                size="small"
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
                            window.open(
                              `${BASE_URL}/file/dl/${item.id}`,
                              "_blank"
                            );
                          }}
                        />
                      </Tooltip>,
                      <ConfirmButton
                        key={"deleteButton"}
                        buttonIcon={<DeleteOutlined />}
                        modalTitle="Do you want to delete this file?"
                        confirmAction={() => deleteFileAction(item.id)}
                        toolTip="Delete File"
                      />
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
                footer={[
                  <Tooltip title="Add files" key={"fileButton"}>
                    <Button
                      type="primary"
                      icon={<FileAddOutlined />}
                      onClick={() => {
                        setShowUploadModal(true);
                      }}
                    >
                      Add File(s)
                    </Button>
                  </Tooltip>,
                  <ConfirmButton
                    key={"deleteButton"}
                    buttonIcon={<DeleteOutlined />}
                    modalTitle="Do you want to delete this link?"
                    modalDescription="All files will also be deleted"
                    buttonText="Delete"
                    confirmAction={deleteLinkAction}
                    toolTip="Delete Link"
                  />
                ]}
              />
            </Card>
          </Col>
        </Row>
      )}
      {showUploadModal && (
        <Modal
          title="Upload New Files"
          visible={showUploadModal}
          onOk={uploadNewFiles}
          confirmLoading={uploading}
          onCancel={() => {
            resetFiles();
            setShowUploadModal(false);
          }}
        >
          <Uploader />
        </Modal>
      )}
    </>
  );
};
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer, auth: state.auth };
};
export default connect(mapStateToProps, {
  getLinkDetails,
  deleteLink,
  deleteFile,
  addFiles,
  editLink,
  resetUploader
})(EditLinkPage);

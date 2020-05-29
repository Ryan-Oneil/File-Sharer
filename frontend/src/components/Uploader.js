import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import Dragger from "antd/lib/upload/Dragger";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getQuotaStats } from "../actions/user";
import {
  resetUploader,
  setHasReachedLimit,
  uploaderAddFile,
  uploaderRemoveFile
} from "../actions/fileshare";
import StopOutlined from "@ant-design/icons/lib/icons/StopOutlined";

const Uploader = props => {
  const { used, max } = props.user.storageQuota;
  const { name } = props.auth.user;
  const { size, reachedLimit } = props.fileSharer.linkUpload;

  //Loads most recent quota count
  useEffect(() => {
    props.resetUploader();
    props.getQuotaStats(name);
  }, []);

  useEffect(() => {
    const maxInBytes = max * 1000000000;
    const hasReachedLimit = size + used >= maxInBytes;

    if (hasReachedLimit) {
      props.setHasReachedLimit(true);
      //Only changes reached limit to false if it was previously true
    } else if (reachedLimit && !hasReachedLimit) {
      props.setHasReachedLimit(false);
    }
  }, [size, max]);

  const removeFile = file => {
    props.uploaderRemoveFile(file);
  };

  const config = {
    name: "file",
    multiple: true,
    beforeUpload: file => {
      props.uploaderAddFile(file);
      return false;
    },
    onRemove: file => {
      removeFile(file);
    }
  };
  return (
    <Dragger {...config} {...props}>
      <p className="ant-upload-drag-icon">
        {reachedLimit ? <StopOutlined /> : <InboxOutlined />}
      </p>
      <p>
        {reachedLimit
          ? "These files exceed your quota"
          : "Click or drag file to this area to upload"}
      </p>
    </Dragger>
  );
};
const mapStateToProps = state => {
  return { user: state.user, auth: state.auth, fileSharer: state.fileSharer };
};
export default connect(mapStateToProps, {
  getQuotaStats,
  uploaderAddFile,
  uploaderRemoveFile,
  setHasReachedLimit,
  resetUploader
})(Uploader);

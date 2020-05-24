import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import Dragger from "antd/lib/upload/Dragger";
import React from "react";

export default props => {
  const { setFiles, setTotalSize, files } = props;

  const removeFile = file => {
    const index = files.indexOf(file);
    const modifiedList = files.slice();

    modifiedList.splice(index, 1);
    setFiles(modifiedList);
    setTotalSize(prevState => prevState - file.size);
  };

  const config = {
    name: "file",
    multiple: true,
    beforeUpload: file => {
      setFiles(prevState => [...prevState, file]);
      setTotalSize(prevState => prevState + file.size);
      return false;
    },
    onRemove: file => {
      removeFile(file);
    }
  };

  return (
    <Dragger {...config} {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p>Click or drag file to this area to upload</p>
    </Dragger>
  );
};

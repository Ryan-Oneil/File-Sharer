import React, { useEffect, useState } from "react";
import { Button, Card, Table, Tooltip } from "antd";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { displayBytesInReadableForm } from "../../helpers";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  deleteLink,
  getUserLinkCount,
  getUserLinks
} from "../../actions/fileshare";
import { BASE_URL } from "../../apis/api";
import ConfirmButton from "../../components/ConfirmButton";

const ManageFilePage = props => {
  const { activeFiles } = props.fileSharer;
  const { totalLinks } = props.fileSharer.stats;
  const { match } = props;
  const [loadingData, setLoadingData] = useState(true);
  const { name } = props.auth.user;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalLinks
  });

  const loadLinks = ({ current, pageSize }, sorter) => {
    setLoadingData(true);

    //current is always reduced by 1 since backend starts page at 0 while frontend starts at 1
    props
      .getUserLinks(name, current - 1, pageSize, sorter)
      .then(() => setLoadingData(false));
  };

  useEffect(() => {
    if (totalLinks === 0 && activeFiles.length === 0) {
      props.getUserLinkCount(name);
    }
    loadLinks(pagination);
  }, []);

  useEffect(() => {
    setPagination(prevState => {
      return { ...prevState, total: totalLinks };
    });
  }, [totalLinks]);

  const columns = [
    {
      title: "Created",
      dataIndex: "creationDate",
      sorter: true
    },
    {
      title: "Title",
      dataIndex: "title",
      render: name => (name ? name : "N/A")
    },
    {
      title: "Expires",
      dataIndex: "expiryDatetime",
      sorter: true
    },
    {
      title: "Views",
      dataIndex: "views",
      sorter: true
    },
    {
      title: "Size",
      dataIndex: "size",
      render: size => displayBytesInReadableForm(size),
      sorter: true
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <>
          <Tooltip title="View">
            <Link to={`/shared/${record.id}`}>
              <Button shape="circle" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Download">
            <Button
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={() => {
                window.open(`${BASE_URL}/download/${record.id}`, "_blank");
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Link to={`${match.path}/edit/${record.id}`}>
              <Button shape="circle" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          <ConfirmButton
            toolTip="Delete"
            buttonIcon={<DeleteOutlined />}
            confirmAction={() => props.deleteLink(record.id)}
            modalTitle="Do you want to delete this link?"
            modalDescription="All files will also be deleted"
          />
        </>
      )
    }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    loadLinks(pagination, sorter);
  };
  return (
    <Card title="My Shared Links">
      <Table
        dataSource={activeFiles}
        columns={columns}
        rowKey={link => link.id}
        pagination={pagination}
        loading={loadingData}
        onChange={handleTableChange}
      />
    </Card>
  );
};
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer, auth: state.auth };
};
export default connect(mapStateToProps, {
  getUserLinks,
  deleteLink,
  getUserLinkCount
})(ManageFilePage);

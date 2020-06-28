import React from "react";
import { Button, Card, Tooltip } from "antd";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { displayBytesInReadableForm } from "../../helpers";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteLink, getUserLinks } from "../../actions/fileshare";
import ConfirmButton from "../../components/ConfirmButton";
import PaginationTable from "../../components/Tables/PaginationTable";

const ManageFilePage = props => {
  const { activeFiles } = props.fileSharer;
  const { totalLinks } = props.fileSharer.stats;
  const { match } = props;
  const { name } = props.auth.user;

  const columns = [
    {
      title: "Created",
      dataIndex: "creationDate",
      sorter: true,
      defaultSortOrder: "descend"
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
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => {
                window.open(`/shared/${record.id}`, "_blank");
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
            shape="circle"
            buttonIcon={<DeleteOutlined />}
            confirmAction={() => props.deleteLink(record.id)}
            modalTitle="Do you want to delete this link?"
            modalDescription="All files will also be deleted"
          />
        </>
      )
    }
  ];

  return (
    <Card title="My Shared Links">
      <PaginationTable
        totalData={totalLinks}
        data={activeFiles}
        columns={columns}
        fetchData={(page, size, sorter) =>
          props.getUserLinks(name, page, size, sorter)
        }
        defaultSort={{ field: "creationDate", order: "descend" }}
      />
    </Card>
  );
};
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer, auth: state.auth };
};
export default connect(mapStateToProps, {
  getUserLinks,
  deleteLink
})(ManageFilePage);

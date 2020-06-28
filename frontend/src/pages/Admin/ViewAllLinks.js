import React, { useEffect } from "react";
import { Button, Card, Tooltip } from "antd";
import { displayBytesInReadableForm } from "../../helpers";
import { connect } from "react-redux";
import {
  deleteLink,
  getAdminLinkStats,
  getAllLinksPageable
} from "../../actions/fileshare";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { Link } from "react-router-dom";
import LinkTable from "../../components/Tables/PaginationTable";

const ViewAllLinks = props => {
  const { match } = props;
  const { activeFiles, totalLinks } = props.admin.fileShare;

  useEffect(() => {
    if (totalLinks === 0 && activeFiles.length === 0) {
      props.getAdminLinkStats();
    }
  }, []);

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
      render: name => (name ? name : "N/A"),
      sorter: true
    },
    {
      title: "Creator",
      dataIndex: "creator",
      sorter: true
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
        <Tooltip title="Edit">
          <Link to={`${match.path}/edit/${record.id}`}>
            <Button shape="circle" icon={<EditOutlined />} />
          </Link>
        </Tooltip>
      )
    }
  ];

  return (
    <Card>
      <LinkTable
        data={activeFiles}
        columns={columns}
        totalData={totalLinks}
        fetchData={props.getAllLinksPageable}
        defaultSort={{ field: "creationDate", order: "descend" }}
      />
    </Card>
  );
};
const mapStateToProps = state => {
  return { admin: state.admin };
};
export default connect(mapStateToProps, {
  deleteLink,
  getAllLinksPageable,
  getAdminLinkStats
})(ViewAllLinks);

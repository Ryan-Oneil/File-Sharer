import React, { useEffect, useState } from "react";
import { Button, Card, Table, Tooltip } from "antd";
import { displayBytesInReadableForm } from "../../helpers";
import { connect } from "react-redux";
import {
  deleteLink,
  getAdminLinkStats,
  getAllLinksPageable
} from "../../actions/fileshare";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { Link } from "react-router-dom";

const ViewAllLinks = props => {
  const { match } = props;
  const { activeFiles, totalLinks } = props.fileSharer.adminStats;
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalLinks
  });

  const loadLinks = ({ current, pageSize }) => {
    setLoading(true);

    //current is always reduced by 1 since backend starts page at 0 while frontend starts at 1
    props
      .getAllLinksPageable(current - 1, pageSize, "creationDate")
      .then(() => setLoading(false));
  };

  useEffect(() => {
    if (totalLinks === 0 && activeFiles.length === 0) {
      props.getAdminLinkStats();
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
      dataIndex: "creationDate"
    },
    {
      title: "Title",
      dataIndex: "title",
      render: name => (name ? name : "N/A")
    },
    {
      title: "Creator",
      dataIndex: "creator"
    },
    {
      title: "Expires",
      dataIndex: "expiryDatetime"
    },
    {
      title: "Views",
      dataIndex: "views"
    },
    {
      title: "Size",
      dataIndex: "size",
      render: size => displayBytesInReadableForm(size)
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

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    setPagination(pagination);
    loadLinks(pagination);
  };

  return (
    <Card>
      <Table
        dataSource={activeFiles}
        columns={columns}
        rowKey={link => link.id}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/*<Tabs defaultActiveKey="1">*/}
      {/*  <TabPane tab="Active" key="1" style={{ outline: "none" }}>*/}
      {/*    {activeLinkList()}*/}
      {/*  </TabPane>*/}
      {/*</Tabs>*/}
    </Card>
  );
};
const mapStateToProps = state => {
  return { fileSharer: state.fileSharer };
};
export default connect(mapStateToProps, {
  deleteLink,
  getAllLinksPageable,
  getAdminLinkStats
})(ViewAllLinks);

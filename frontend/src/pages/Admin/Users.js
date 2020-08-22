import React, { useEffect, useState } from "react";
import { Button, Card, Table, Tooltip } from "antd";
import { connect, useDispatch } from "react-redux";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../reducers/adminReducer";

const Users = props => {
  const dispatch = useDispatch();
  const { users, totalUsers } = props.admin;
  const { match } = props;
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalUsers
  });
  const loadLinks = ({ current, pageSize }, sorter) => {
    setLoading(true);

    //current is always reduced by 1 since backend starts page at 0 while frontend starts at 1
    dispatch(getAllUsers(current - 1, pageSize, sorter)).then(() =>
      setLoading(false)
    );
  };

  useEffect(() => {
    loadLinks(pagination);
  }, []);

  useEffect(() => {
    setPagination(prevState => {
      return { ...prevState, total: totalUsers };
    });
  }, [totalUsers]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      defaultSortOrder: "descend"
    },
    {
      title: "Username",
      dataIndex: "name"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: true
    },
    {
      title: "Status",
      dataIndex: "enabled",
      render: enabled => (enabled ? "Enabled" : "Disabled"),
      sorter: true
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Tooltip title="Edit">
          <Link to={`${match.path}/${record.name}`}>
            <Button shape="circle" icon={<EditOutlined />} />
          </Link>
        </Tooltip>
      )
    }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    loadLinks(pagination, sorter);
  };

  return (
    <Card>
      <Table
        dataSource={users}
        columns={columns}
        rowKey={user => user.username}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};
const mapStateToProps = state => {
  return { admin: state.admin };
};
export default connect(mapStateToProps)(Users);

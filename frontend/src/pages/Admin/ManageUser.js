import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Breadcrumb, Button, Card, Col, Row, Tabs, Tooltip } from "antd";
import { Link } from "react-router-dom";
import EditUserForm from "../../components/form/EditUserForm";
import { displayBytesInReadableForm } from "../../helpers";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import ConfirmButton from "../../components/ConfirmButton";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import PaginationTable from "../../components/Tables/PaginationTable";
import {
  adminGetUserLinks,
  deleteLink,
  getUserFileStats
} from "../../actions/fileshare";
import StatisticCard from "../../components/Stats/StatisticCard";
import { adminGetUserDetails } from "../../actions/user";
const { TabPane } = Tabs;

const EditUser = props => {
  const { match } = props;
  const { user } = props.match.params;
  const { account, files } = props.admin.user;
  const { totalLinks, totalViews } = props.admin.user.stats;
  const [loadingFileStats, setLoadingFileStats] = useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);

  const loadUserStats = () => {
    props.getUserFileStats(user).then(() => setLoadingFileStats(false));
    props.adminGetUserDetails(user).then(() => setLoadingUserDetails(false));
  };

  useEffect(() => {
    loadUserStats();
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
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/users">Manage Users</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{user}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Account Settings" key="1">
            <Row gutter={[32, 32]} type="flex">
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <EditUserForm user={account} loading={loadingUserDetails} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Files" key="2">
            <PaginationTable
              totalData={totalLinks}
              data={files}
              columns={columns}
              fetchData={(page, size, sorter) =>
                props.adminGetUserLinks(account.name, page, size, sorter)
              }
              defaultSort={{ field: "creationDate", order: "descend" }}
            />
          </TabPane>
          <TabPane tab="Stats" key="3">
            <Row gutter={[32, 32]} type="flex" justify="center">
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Links"}
                  value={totalLinks}
                  loading={loadingFileStats}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Link Views"}
                  value={totalViews}
                  loading={loadingFileStats}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Used Storage"}
                  value={displayBytesInReadableForm(account.quota.used)}
                  loading={loadingUserDetails}
                />
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <StatisticCard
                  title={"Total Usable Storage"}
                  value={`${account.quota.max} GB`}
                  loading={loadingUserDetails}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

const mapStateToProps = state => {
  return {
    admin: state.admin
  };
};
export default connect(mapStateToProps, {
  adminGetUserLinks,
  deleteLink,
  getUserFileStats,
  adminGetUserDetails
})(EditUser);

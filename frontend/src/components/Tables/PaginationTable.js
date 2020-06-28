import React, { useEffect, useState } from "react";
import { Table } from "antd";

export default props => {
  const { totalData, fetchData, data, columns, defaultSort } = props;
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalData
  });

  const loadData = ({ current, pageSize }, sorter) => {
    setLoading(true);

    //current is always reduced by 1 since backend starts page at 0 while frontend starts at 1
    fetchData(current - 1, pageSize, sorter).then(() => setLoading(false));
  };

  useEffect(() => {
    loadData(pagination, defaultSort);
  }, []);

  useEffect(() => {
    setPagination(prevState => {
      return { ...prevState, total: totalData };
    });
  }, [totalData]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    loadData(pagination, sorter);
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={item => item.id}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

import React from "react";
import { Card } from "antd";
import { getAllLinksPageable } from "../../reducers/fileReducer";
import SharedLinkTable from "../../components/Tables/SharedLinkTable";

export default props => {
  const { match } = props;

  return (
    <Card>
      <SharedLinkTable
        editPath={match.path}
        fetchData={getAllLinksPageable}
        defaultSort={{ field: "creationDate", order: "descend" }}
      />
    </Card>
  );
};

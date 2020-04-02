import React from "react";
import { Card, Statistic } from "antd";

export default props => {
  return (
    <Card>
      <Statistic {...props} />
    </Card>
  );
};

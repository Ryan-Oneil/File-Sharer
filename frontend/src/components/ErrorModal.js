import { Modal } from "antd";

export default ({ message }) => {
  return Modal.error({
    title: "An error has occurred",
    content: message
  });
};

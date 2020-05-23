import { Modal } from "antd";

export default message => {
  Modal.error({
    title: "An error has occurred",
    content: message
  });
};

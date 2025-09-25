import React from "react";
import { Input, Modal } from "antd";
import { MailOutlined } from "@ant-design/icons";

interface ModalReportProps {
  open: boolean;
  onClose: () => void;
}

function ModalReport(props:ModalReportProps) {
  const { open, onClose } = props;

  const handleOkModal = () => {
    //console.log("ok");
    //onClose();
  };
  const handleCancelModal = () => {
    //console.log("cancel");
    onClose();
  };
  return (
    <>
      <Modal
        title="Please tell us your reason"
        open={open}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        okText="Send"
        cancelButtonProps={{ style: { display: "none" } }}
        okType="primary"
      >
        <Input status="warning" prefix={<MailOutlined />} />
      </Modal>
    </>
  );
}

export default ModalReport;

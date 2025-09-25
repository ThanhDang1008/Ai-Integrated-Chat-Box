import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
const { confirm } = Modal;

const pathLogin = "/login";

function SessionExpires({

  handleOnOK,
}: {

  handleOnOK: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation()
  const path = location.pathname;

  const showConfirm = () => {
    confirm({
      title: "Phiên đăng nhập đã hết hạn",
      icon: <ExclamationCircleFilled />,
      content: "Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống",
      okText: "Đăng nhập",
      onOk() {
        //window.location.href = pathLogin;
        handleOnOK();
        if (path !== pathLogin) {
          navigate(pathLogin);
        }
      },
      cancelButtonProps: { style: { display: "none" } },
      //centered: true,
    });
  };

  useEffect(() => {
    if (path !== pathLogin) {
      return showConfirm();
    }
  }, [path]);
  return <></>;
}

export default SessionExpires;

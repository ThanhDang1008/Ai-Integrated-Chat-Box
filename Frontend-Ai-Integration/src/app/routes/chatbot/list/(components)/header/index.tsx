import React from "react";
import "./header.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


function Header () {
    const navigate = useNavigate();
    const handleBack = () => {
      navigate("/"); 
    };
  return (
    <div>
    <div className="ListChatbot_Header_container">
      <Button onClick={handleBack}>
        <RollbackOutlined />
      </Button>
      <div className="banner">
        <img
          className="img-banner"
          src="https://ctuet.edu.vn/View/assets/images/banner_test.jpg"
          alt="Truong dai hoc ky thuat cong nghe can tho"
        />
      </div>

      <div className="topheader-left">
        <div className="logo">
          <img
            className="img-logo"
            src="https://ctuet.edu.vn/View/assets/images/logo.png"
            alt=""
          />
        </div>
        <div className="text-logo">
          <h2>
            TRƯỜNG ĐẠI HỌC
            <br />
            KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
          </h2>
          <h5 className="slogan">
            chất lượng - sáng tạo - năng động - phát triển
          </h5>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Header;
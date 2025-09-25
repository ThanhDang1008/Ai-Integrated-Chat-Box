import React from "react";
import "./footer.scss";
import { FacebookOutlined, LinkedinOutlined } from "@ant-design/icons";

function Footer() {
  return (
    <div className="footer-chatbot">
      <div className="footer_info_chatbot">
        <p>TRƯỜNG ĐẠI HỌC KỸ THUẬT - CÔNG NGHỆ CẦN THƠ</p>
        <p>Địa chỉ: 256 Nguyễn Văn Cừ, Quận Ninh Kiều, Thành phố Cần Thơ</p>
        <p>Email: phonghanhchinh@ctuet.edu.vn</p>
      </div>
      <div className="footer_social_chatbot">
        <div className="footer_icon_chatbot">
          <FacebookOutlined />
          <LinkedinOutlined />
        </div>
      </div>
    </div>
  );
}

export default Footer;

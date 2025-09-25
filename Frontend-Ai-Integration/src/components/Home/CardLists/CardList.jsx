import React from "react";
import "./CardLists.scss";

const Cardlist = () => {
  return (
    <>
      <div className="home_cardlist_container" id="home_cardlist">
        <div className="container_title">
          Inspiration from famous software developers
        </div>
        <div className="card-list">
          <div className="card-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzqzF_WZHN_UVYhwzrX06_7vpjDARPzKSmpQ&s"
              className="user-img"
            />
            <h1 className="user-name">Akshat Paul</h1>
            <h3 className="user-profession">
              (Một nhà phát triển phần mềm và nhà văn.)
            </h3>
            <p className="user-comment">
              “Giao diện người dùng là quá trình chuyển đổi từ sự phức tạp hỗn
              loạn sang sự đơn giản thanh lịch.”
            </p>
          </div>
          <div className="card-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXx3VEQ1O9dBfNrTB0TdMhM9_fSR05q64n9w&s"
              className="user-img"
            />
            <h1 className="user-name">Alan Cooper</h1>
            <h3 className="user-profession">
              (Một lập trình viên và nhà thiết kế phần mềm người Mỹ, được biết
              đến là cha đẻ của Visual Basic.)
            </h3>
            <p className="user-comment">
              "The AskYourAI modernizes document management with AI, boosting
              productivity and seamless collaboration"
            </p>
          </div>
          <div className="card-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRyuJ6nPhRPVIjboBn9LxlzBkOVl-oLqNSmg&s"
              className="user-img"
            />
            <h1 className="user-name">Alan Kay</h1>
            <h3 className="user-profession">
              (Một nhà khoa học máy tính người Mỹ được biết đến với công trình
              tiên phong trong lĩnh vực máy tính, lập trình hướng đối tượng và
              thiết kế GUI.)
            </h3>
            <p className="user-comment">
              “Cách tốt nhất để dự đoán tương lai là phát minh ra nó.”
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cardlist;

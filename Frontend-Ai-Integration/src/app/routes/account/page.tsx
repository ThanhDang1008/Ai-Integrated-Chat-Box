import { Tabs } from "antd";
import "./account.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "./(components)/profile";
import Chat from "./(components)/chat";

function Account() {
  const { user } = useSelector((state:any) => state.account);
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          height: "100vh",
          padding: "2%",
        }}
        className="account_container"
      >
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          tabBarExtraContent={{
            right: (
              <>
                {/* <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    className="account_header_avatar"
                    src="https://res.cloudinary.com/dg2awknkk/image/upload/v1704732879/bc1qqdokbeedqas6yfro.jpg"
                  />
                </div>

                <div
                  style={{ color: "#00a65c" }}
                  className="account_header_email"
                >
                  <b>{user.fullname}</b>
                </div> */}
              </>
            ),
            left: (
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="account_header_goback"
                title="Go back"
              >
                <i className="bi bi-arrow-left"></i>
              </div>
            ),
          }}
          items={[
            {
              label: "Profile",
              key: "1",
              children: <Profile />,
            },
            {
              label: "Chat",
              key: "2",
              children: <Chat />,
            },
            {
              label: "Help",
              key: "3",
              children: <div>Help</div>,
            },
          ]}
        />
      </div>
    </>
  );
}

export default Account;

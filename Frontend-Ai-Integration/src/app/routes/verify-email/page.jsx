import { useSearchParams, NavLink } from "react-router-dom";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/services/api/auth/auth";
import { Button, Result } from "antd";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const sendVerify = async (token) => {
    setLoading(true);
    try {
      const response = await verifyEmail(token);
      //console.log("response", response);
      if (response.status === 200) {
        setMessage({
          messageSuccess: {
            title: response.data.message,
            subTitle: `Your email has been successfully verified. You can now login to your account.`,
          },
        });
      }
    } catch (error) {
      //console.log("error", error);
      if (error.response.status === 400 || error.response.status === 401) {
        setMessage({
          messageError: {
            title: error.response.data.message,
            subTitle: `Your email verification link is invalid or has expired. Please
              request a new verification link.`,
          },
        });
      } else {
        setMessage({
          messageError: {
            title: "Something went wrong!",
            subTitle: `Please try again later.`,
          },
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    sendVerify(token);
  }, [token]);

  return (
    <div className="container">
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin tip="Loading" size="large"></Spin>
        </div>
      )}
      {!loading && (
        <Result
          status={message.messageError ? "error" : "success"}
          title={
            message.messageError
              ? message.messageError?.title
              : message.messageSuccess?.title
          }
          subTitle={
            message.messageError
              ? message.messageError?.subTitle
              : message.messageSuccess?.subTitle
          }
          extra={[
            // <Button type="text" key="console">
            //   {message.messageError ? "Find out more?" : "Login"}
            // </Button>
            <NavLink to={message.messageError ? "/contact" : "/login"}>
              <Button type="primary" key="console">
                {message.messageError ? "Find out more?" : "Login"}
              </Button>
            </NavLink>,
          ]}
        />
      )}
    </div>
  );
}

export default VerifyEmail;

import axios from "axios";
// import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";

// import {
//   GoogleLogin,
//   useGoogleOneTapLogin,
//   useGoogleLogin,
// } from "@react-oauth/google";
import Header from "@/components/Header";
import { formatTime } from "@/utils/formatTime";
import { loginCredentials } from "@/services/api/auth/auth";
import HttpStatusCode from "@/constants/httpStatusCode.enum";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [infoUser, setInfoUser] = useState({
    name: "",
    email: "",
  });

  const [currentTime, setCurrentTime] = useState("Đã gửi");
  const [timeNumber, setTimeNumber] = useState(-1);
  const [isPendingLogin, setIsPendingLogin] = useState<boolean>(false);

  const onFinish = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    setIsPendingLogin(true);
    try {
      const response = await loginCredentials(username, password);
      if (response.status === HttpStatusCode.Ok) {
        //dispatch(doLoginAction(response.data));
        setIsPendingLogin(false);
        queryClient.invalidateQueries({
          queryKey: ["INFO_USER"],
        });
        message.success(response.data.message);
        navigate("/");
      }
    } catch (error: any) {
      setIsPendingLogin(false);

      message.error(error.response?.data?.message || "Something went wrong");

      if (error.response.status === HttpStatusCode.Unauthorized) {
        //console.log("error:", error);
        setInfoUser({
          name: error.response?.data?.data?.fullname,
          email: username,
        });
        setIsModalOpen(true);
      }
    }

    //console.log("response:", response);
  };

  const onFinishFailed = () => {
    alert("Vui lòng nhập đúng thông tin");
    //console.log("Failed:", errorInfo);
  };
  //background-image: linear-gradient(to top, #4a6da3, #2a7ec8, #4383a9, #33809e, #2a7bae)
  const handleOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (timeNumber >= 0) {
      const interval = setInterval(() => {
        setTimeNumber((prevTime) => prevTime - 1);
        if (timeNumber === 0) {
          setCurrentTime("Đã gửi");
        }
        if (timeNumber > 0) {
          setCurrentTime(formatTime(timeNumber));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeNumber]);

  const resendEmail = async () => {
    setTimeNumber(60);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/mail/send-mail-verify`,
        {
          name_project: "AskYourAI",
          email_project: "noreply@askyourai.com",
          name_user: infoUser.name || "friend",
          email_user: infoUser.email,
          url_verify: `${import.meta.env.VITE_FRONTEND_URL}/verify-email`,
          url_contact: `${import.meta.env.VITE_FRONTEND_URL}/contact`,
          url_feedback: `${import.meta.env.VITE_FRONTEND_URL}/feedback`,
        }
      );
      if (response.status === HttpStatusCode.Ok) {
        message.success(response.data.message);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Send email failed");
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     const decoded = jwtDecode(tokenResponse.access_token);
  //     console.log("tokenResponse",tokenResponse)
  //     console.log("decoded:", decoded);
  //   },
  //   onError: (error) => {
  //     console.log("Login Failed", error);
  //   }
  // });

  return (
    <>
      <Header
        customStyles={{
          colorPageLogin: true,
          backgroundColor: "rgb(0 0 0 / 20%)",
        }}
      />
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #4d6d9f, #5186b5, #589fc8, #65b9d9, #78d2e8)",
          minHeight: "110vh",
          overflow: "hidden",
        }}
        className=" d-flex justify-content-center align-items-center"
      >
        <div
          style={{
            padding: 20,
            borderRadius: 10,
            background:
              "linear-gradient(19deg, rgb(151, 149, 149), rgb(255 240 206 / 74%))",
            boxShadow:
              "rgb(184 115 115) 33px 27px 51px, rgb(236 36 36) -25px -25px 100px",
            filter: "invert(1)",
          }}
          className="col-lg-6 col-md-8 col-10"
        >
          <h3 className="text-center">Login</h3>
          <br />
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "90%" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            validateMessages={{
              required: "${label} is required!",
              types: {
                email: "${label} is not a valid email!",
              },
              number: {
                range: "${label} must be between ${min} and ${max} characters!",
              },
            }}
          >
            <Form.Item
              //labelCol={{ span: 24 }}
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  type: "email",
                  max: 50,
                  min: 5,
                },
              ]}
            >
              <Input
                style={{
                  backgroundColor: "#b698982e",
                  border: "1px solid #c88a8aa8",
                }}
              />
            </Form.Item>

            <Form.Item
              //labelCol={{ span: 24 }}
              label="Password"
              name="password"
              rules={[{ required: true, min: 6, max: 25 }]}
            >
              <Input.Password
                style={{
                  backgroundColor: "#b698982e",
                  border: "1px solid #c88a8aa8",
                }}
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 3 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={isPendingLogin}
                className="col-12 col-sm-8 col-lg-5"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div className="mx-3">
            <p>
              You don't have an account?{" "}
              <a
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register
              </a>
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log("decoded:", decoded);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            /> */}
            <Button
              type="default"
              style={{
                // backgroundColor: "#4285f4",
                // borderColor: "#4285f4",
                color: "rgb(102 69 69)",
                padding: "17px 20px",
              }}
              // onClick={() => {
              //   login();
              // }}
            >
              <i className="bi bi-google" style={{ fontSize: 18 }}></i>
              Login with Google
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="Thông báo"
        open={isModalOpen}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={handleOk}
      >
        <p style={{ margin: 0, color: "red" }}>
          Tài khoản <strong>{infoUser.email}</strong> chưa được xác thực. Vui
          lòng kiểm tra email của bạn để xác thực tài khoản.
        </p>
        <p>
          Nhấn vào đây để gửi lại email xác thực{" "}
          <Button
            type="link"
            onClick={() => {
              resendEmail();
            }}
            disabled={timeNumber >= 0}
          >
            {timeNumber === -1 ? (
              <>
                Gửi lại <i className="bi bi-cursor-fill"></i>
              </>
            ) : (
              <>{currentTime}</>
            )}
          </Button>
        </p>
      </Modal>
    </>
  );
}

export default Login;

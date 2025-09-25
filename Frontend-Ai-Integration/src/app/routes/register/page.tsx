import { Button, Checkbox, Form, Input, Select, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { register } from "@/services/api/auth/auth";
import { useEffect, useState } from "react";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import Header from "@/components/Header";
import { formatTime } from "@/utils/formatTime";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoUser, setInfoUser] = useState({
    name: "",
    email: "",
  });
  const [currentTime, setCurrentTime] = useState("Đã gửi");
  const [timeNumber, setTimeNumber] = useState(-1);
  const [form_register] = Form.useForm();

  interface IFormValues {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    gender: string;
  }

  const onFinish = async (values: IFormValues) => {
    //console.log("values", values);
    const { fullname, email, phone, password, gender } = values;
    const body = {
      fullname: fullname.trim(),
      email,
      phone,
      password,
      gender: gender.toUpperCase(),
      type: "SYSTEM",
    };

    try {
      const response = await register(body);
      if (response.status === HttpStatusCode.Created) {
        setInfoUser({
          name: fullname,
          email: email,
        });
        sendEmail(fullname, email);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Register failed");
    }
  };

  const onFinishFailed = () => {
    alert("Vui lòng nhập đúng thông tin");
    //console.log("Failed:", errorInfo);
  };

  const handleOk = () => {
    form_register.resetFields();
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

  const sendEmail = async (fullname: string, email: string) => {
    setTimeNumber(60);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/mail/send-mail-verify`,
        {
          name_project: "AskYourAI",
          email_project: "noreply@askyourai.com",
          name_user: fullname,
          email_user: email,
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
          minHeight: "125vh",
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
              "rgb(184, 115, 115) 33px 27px 51px, rgb(236, 36, 36) -25px 46px 100px",
            filter: "invert(1)",
          }}
          className="col-lg-6 col-md-8 col-10"
        >
          <h3 className="text-center">Register</h3>
          <br />
          <Form
            name="basic"
            form={form_register}
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
                number: "${label} is not a valid number!",
              },
              number: {
                range: "${label} must be between ${min} and ${max} characters!",
              },
              // pattern: {
              //   mismatch: "${label} is not valid!",
              // },
            }}
          >
            <Form.Item
              //labelCol={{ span: 24 }}
              label="Fullname"
              name="fullname"
              rules={[
                { required: true, message: "Please input your fullname!" },
                {
                  min: 5,
                  max: 35,
                  message: "Fullname must be between 5 and 35 characters!",
                },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9\s]+$/),
                  message: "Fullname must contain only letters and numbers!",
                },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/),
                  message:
                    "The full name must contain only 1 space between words and no extra spaces",
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
              label="Email"
              name="email"
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

            {/* <Form.Item
              //labelCol={{ span: 24 }}
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                },
              ]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select a option and change input text above"
                // onChange={onGenderChange}
                // allowClear
                // style={{
                //   backgroundColor: "#b698982e",
                //   border: "1px solid #c88a8aa8"
                // }}
              >
                <Select.Option value="male">male</Select.Option>
                <Select.Option value="female">female</Select.Option>
                <Select.Option value="other">other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              //labelCol={{ span: 24 }}
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 6,
                  max: 25,
                  message: "Password must be between 6 and 25 characters!",
                },
                {
                  pattern: new RegExp(
                    // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]+$/
                    /^[A-Za-z\d@$!%*#?&.]+$/
                  ),
                  message:
                    // "Password must contain at least one letter, one number, and one special character (@$!%*#?&.)",
                    "The full name can only be letters, numbers or a few special characters (@$!%*#?&.)",
                },
              ]}
            >
              <Input.Password
                style={{
                  backgroundColor: "#b698982e",
                  border: "1px solid #c88a8aa8",
                }}
              />
            </Form.Item>

            <Form.Item
              //labelCol={{ span: 24 }}
              label="Confirm Password"
              name="passwordConfirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
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

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                Next
              </Button>
            </Form.Item>
          </Form>
          <div className="mx-3">
            <p>
              Already have an account?{" "}
              <a
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </a>
            </p>
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
        <p style={{ margin: 0, color: "#005f00" }}>
          Xin chào <strong>{infoUser.name}</strong>,
        </p>
        <p style={{ margin: 0, color: "#005f00" }}>
          Hãy kiểm tra hộp thư email <strong>{infoUser.email}</strong> của bạn
          để xác thực tài khoản.
        </p>
        <p>
          Bạn không nhận được email?{" "}
          <Button
            type="link"
            onClick={() => {
              sendEmail(infoUser.name, infoUser.email);
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

export default Register;

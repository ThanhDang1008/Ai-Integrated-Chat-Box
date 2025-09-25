import React, { useState, useEffect } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  CaretDownFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  Typography,
  Select,
  Upload,
  Image,
  Form,
  Modal,
  message,
  Popconfirm,
} from "antd";
import "./profile.scss";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import { getInfoUser } from "@/services/api/user";


function Profile() {
  
  const [editInfo, setEditInfo] = useState({
    edit: false,
    loading: false,
  });
  const [valueProfile, setValueProfile] = useState(null);
  const avatar_default =
    "https://res.cloudinary.com/dg2awknkk/image/upload/v1704893359/idfox8zxaxohuowilxfw.jpg";
  const [form_profile] = Form.useForm();

  const [loadingFileUploadUser, setLoadingFileUploadUser] = useState(false);

  const [deleteAvatar, setDeleteAvatar] = useState({
    open: false,
    loading: false,
  });

  const [fileUploadUser, setFileUploadUser] = useState(null);
  const [isModalPreviewAvatar, setIsModalPreviewAvatar] = useState(false);

  //console.log("valueProfile", valueProfile);
  //console.log("fileUploadUser", fileUploadUser);

  const {
    data: info_user,
    isLoading,
    isError,
    error: data_error,
  } = useQuery({
    queryKey: ["INFO_USER"],
    queryFn: () => getInfoUser(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    retryDelay: 2000,
    retryOnMount: true,
  });
 // console.log("info_user", info_user);
 // console.log("valueProfile", valueProfile);

  useEffect(() => {
    if (info_user) {
      setValueProfile({
        fullname: info_user.fullname,
        phone: info_user.phone,
        email: info_user.email,
        gender: info_user.gender,
        avatar: info_user.urlavatar,
      });
    }
  }, [info_user]);

  useEffect(() => {
    return () => {
      if (fileUploadUser) {
        URL.revokeObjectURL(fileUploadUser.preview);
      }
    };
  }, [fileUploadUser]);

  const [mobileUserId, setMobileUserId] = useState("");
  const handleInputChange = (e) => {
    setMobileUserId(e.target.value);
  };

  const showModalPreviewAvatar = () => {
    setIsModalPreviewAvatar(true);
  };

  const handleCancelUploadAvatar = () => {
    setIsModalPreviewAvatar(false);
    setFileUploadUser(null);
  };

  const handleUploadAvatar = async () => {
    let formData = new FormData();
    formData.append("file", fileUploadUser);
    if (valueProfile.avatar !== avatar_default) {
      const keyFileOld = valueProfile.avatar.split("/").pop();
      formData.append("keyFile_old", keyFileOld);
    }
    setLoadingFileUploadUser(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update/avatar/${
          info_user.id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          //  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        //set access token
       // localStorage.setItem("access_token", response.data.data.access_token);
        setValueProfile({
          ...valueProfile,
          avatar: response.data.data.urlavatar,
        });
        setLoadingFileUploadUser(false);
        handleCancelUploadAvatar();
        message.success("Upload avatar success!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setLoadingFileUploadUser(false);
        handleCancelUploadAvatar();
        message.error(error.response.data.message);
      }
    }
  };

  const handleSaveProfile = async (values) => {
    //console.log("values", values);
    const { fullname, phone, gender } = values;
    setEditInfo({
      ...editInfo,
      loading: true,
    });
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update/profile/${
          info_user.id
        }`,
        {
          fullname,
          phone,
          gender,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        //set access token
        //localStorage.setItem("access_token", response.data.data.access_token);
        setValueProfile({
          ...valueProfile,
          fullname: response.data.data.user.fullname,
          phone: response.data.data.user.phone,
          email: response.data.data.user.email,
          gender: response.data.data.user.gender,
        });
        setEditInfo({
          edit: false,
          loading: false,
        });
        message.success("Update profile success!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
        setEditInfo({
          ...editInfo,
          loading: false,
        });
      }
    }
  };

  const handleConfirmDeleteAvatar = async () => {
    setDeleteAvatar({
      ...deleteAvatar,
      loading: true,
    });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/delete/avatar/${
          info_user.id
        }`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //   },
        // }
      );
      if (response.status === 200) {
        //set access token
        //localStorage.setItem("access_token", response.data.data.access_token);
        setValueProfile({
          ...valueProfile,
          avatar: response.data.data.urlavatar,
        });
        setDeleteAvatar({
          ...deleteAvatar,
          loading: false,
          open: false,
        });
        message.success("Delete avatar success!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
        setDeleteAvatar({
          ...deleteAvatar,
          loading: false,
        });
      }
    }
  };
  const handleCancelDeleteAvatar = () => {
    setDeleteAvatar({
      ...deleteAvatar,
      open: false,
    });
  };

  return (
    <>
      <div className="profile_container">
        <div className="container-item">
          <div className="profile_avatar">
            <div>
              <h3 className="text-bodyS">Profile picture</h3>
              <p className="text-bodyS">Accepted files JPG, JPEG, PNG</p>
            </div>
            <div className="profile_avatar_config">
              <Popconfirm
                title="Are you sure to delete this avatar?"
                onConfirm={handleConfirmDeleteAvatar}
                okButtonProps={{
                  disabled: deleteAvatar.loading,
                }}
                onCancel={handleCancelDeleteAvatar}
                okText="Delete"
                cancelText="Cancel"
                open={deleteAvatar.open}
                icon={<DeleteOutlined />}
              >
                <Image
                  src={valueProfile?.avatar || avatar_default}
                  alt="avatar"
                  style={{
                    overflow: "hidden",
                    height: "8vh",
                    width: "8vh",
                    border: "2px solid rgb(113 113 113 / 34%)",
                    boxShadow: "rgb(71 71 71 / 34%) 0px 0px 10px 0px",
                    borderRadius: "50%",
                  }}
                />
              </Popconfirm>

              <>
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const typeFileAccept = [
                      "image/png",
                      "image/jpg",
                      "image/jpeg",
                    ];
                    if (!typeFileAccept.includes(file.type)) {
                      return message.error("File must be JPG, JPEG, PNG");
                    } else {
                      file.preview = URL.createObjectURL(file);
                      setFileUploadUser(file);
                      showModalPreviewAvatar();
                    }
                  }}
                  // onChange={(info) => {
                  //   console.log("info", info);
                  // }}
                  accept=".jpg,.png,.svg,.jpeg"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Button
                  className="ant-btn-delete"
                  danger
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={() => {
                    setDeleteAvatar({
                      ...deleteAvatar,
                      open: true,
                    });
                  }}
                  disabled={valueProfile?.avatar === avatar_default}
                >
                  Delete
                </Button>
              </>
            </div>
          </div>
          <div className="personal-infor">
            <div>
              <h3 className="text-bodyS">Personal Information</h3>
              <p className="text-bodyS">Shown on your public profile</p>
            </div>
            <div>
              {valueProfile && (
                <Form
                  form={form_profile}
                  className="form-input"
                  initialValues={{
                    fullname: valueProfile?.fullname,
                    phone: valueProfile?.phone,
                    email: valueProfile?.email,
                    gender: valueProfile?.gender,
                  }}
                  onFinish={(values) => handleSaveProfile(values)}
                  onFinishFailed={(errorInfo) => {
                    console.log("Failed:", errorInfo);
                    alert("Failed");
                  }}
                >
                  <div className="form-grid">
                    <div className="form-item">
                      <Typography.Title level={4}>Fullname</Typography.Title>
                      <Form.Item
                        name="fullname"
                        rules={[
                          {
                            required: true,
                            message: "Please input your fullname!",
                          },
                          {
                            min: 5,
                            max: 35,
                            message:
                              "Fullname must be between 5 and 35 characters!",
                          },
                          {
                            pattern: new RegExp(/^[a-zA-Z0-9\s]+$/),
                            message:
                              "Fullname must contain only letters and numbers!",
                          },
                          {
                            pattern: new RegExp(
                              /^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/
                            ),
                            message:
                              "The full name must contain only 1 space between words and no extra spaces",
                          },
                        ]}
                      >
                        <Input disabled={!editInfo.edit} />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Typography.Title level={4}>Phone</Typography.Title>
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            pattern: new RegExp(/^[0-9]+$/),
                            message: "Phone number must contain only numbers!",
                          },
                          {
                            min: 10,
                            max: 10,
                            message: "Phone number must be 10 characters!",
                          },
                        ]}
                      >
                        <Input disabled={!editInfo.edit} />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Typography.Title level={4}>
                        Email Address
                      </Typography.Title>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                        ]}
                      >
                        <Input disabled />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Typography.Title level={4}>Gender</Typography.Title>
                      <Form.Item name="gender">
                        <Select
                          size={"large"}
                          disabled={!editInfo.edit}
                          options={[
                            {
                              label: "Male",
                              value: "MALE",
                            },
                            {
                              label: "Female",
                              value: "FEMALE",
                            },
                            {
                              label: "Other",
                              value: "OTHER",
                            },
                          ]}
                          suffixIcon={<CaretDownFilled />}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="container-button">
                    {
                      // Nếu đang ở trạng thái chỉnh sửa thì hiển thị nút Save
                      editInfo.edit && (
                        <>
                          <Button
                            className="ant-btn-save"
                            type="primary"
                            htmlType="submit"
                            disabled={editInfo.loading}
                          >
                            Save
                          </Button>
                          <Button
                            className="ant-btn-cancel"
                            onClick={() => {
                              setEditInfo({
                                ...editInfo,
                                edit: false,
                              });
                              //reset value form
                              form_profile.resetFields();
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )
                    }
                    {!editInfo.edit && (
                      <Button
                        className="ant-btn-save"
                        type="primary"
                        onClick={() => {
                          setEditInfo({
                            ...editInfo,
                            edit: true,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </div>
          </div>
          <div className="password-item">
            <div>
              <h3 className="text-bodyS">Password</h3>
              <p className="text-bodyS">Secure your account</p>
            </div>
            <Button type="primary">Reset Password</Button>
          </div>
          {/* <div className="mobile-user">
            <div>
              <h3 className="text-bodyS">Link Your Mobile Account</h3>
              <p className="text-bodyS">
                Enter your mobile account ID to link your mobile account to your
                web account
              </p>
            </div>
            <form className="link-account" action="" method="POST">
              <Typography.Title level={4}>Mobile User ID</Typography.Title>
              <Input
                value={mobileUserId}
                onChange={handleInputChange}
                placeholder="Enter ID"
              />
              <div className="container-button">
                <Button
                  className="ant-btn-save"
                  type="primary"
                  disabled={!mobileUserId}
                >
                  Link Account
                </Button>
              </div>
            </form>
          </div> */}
          <div className="delete-account">
            <div>
              <h3 className="text-bodyS">Delete your account</h3>
              <p className="text-bodyS">
                Permanently remove all your data, including documents, chats,
                and personal information.
              </p>
            </div>
            <Button type="primary">Delete My Account</Button>
          </div>
        </div>
      </div>

      <Modal
        title="Profile Picture"
        open={isModalPreviewAvatar}
        onOk={handleUploadAvatar}
        onCancel={handleCancelUploadAvatar}
        okText="Upload"
        cancelText="Cancel"
        okButtonProps={{
          disabled: loadingFileUploadUser,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Image
            src={fileUploadUser?.preview}
            alt="avatar_preview"
            style={{
              overflow: "hidden",
              height: "25vh",
              width: "25vh",
              border: "2px solid rgb(44 132 255 / 34%)",
              boxShadow: "rgb(0 15 36 / 34%) 0px 0px 10px 0px",
              borderRadius: "50%",
            }}
          />
          {/* <p>Size: {fileUploadUser?.size} bytes</p>
        <p>Type: {fileUploadUser?.type}</p> */}
          <p
            style={{
              marginTop: "10px",
            }}
          >
            {fileUploadUser?.name}
          </p>
        </div>
      </Modal>
    </>
  );
}
export default Profile;

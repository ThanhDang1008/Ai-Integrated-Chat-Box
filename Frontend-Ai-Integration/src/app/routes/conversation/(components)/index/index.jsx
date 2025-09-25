import {
  Button,
  Card,
  Modal,
  Tabs,
  Upload,
  message,
  Table,
  Empty,
  Switch,
  Alert,
  Tooltip,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatISODate,convertToDesiredFormat} from "@/utils/formatTime";
import { useSelector } from "react-redux";
import { getFilesUser, getListTitleConversation } from "@/services/api/user";
import axios from "axios";

function Index() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);

  const [openModal, setOpenModal] = useState(false);
  const [apiFileUpload, setApiFileUpload] = useState("");
  const [resFileUpload, setResFileUpload] = useState({
    url: "",
  });
  const [dataSource, setDataSource] = useState([]);
  const [titleConversation, setTitleConversation] = useState([]);

  const [modalDeleteConversation, setModalDeleteConversation] = useState({
    open: false,
    idConversation: "",
    titleConversation: "",
    loading: false,
  });

  const [uploadFileOCR, setUploadFileOCR] = useState(null);
  const [useGCVision, setUseGCVision] = useState(false);
  const [useTesseract, setUseTesseract] = useState(false);
  //console.log("titleConversation", titleConversation);
  // console.log("resFileUpload", resFileUpload);
  // console.log("apiFileUpload", apiFileUpload);

  //console.log("useGCVision", useGCVision);

  const handleStartConversation = () => {
    navigate(
      `/conversation/c/newchat?url=${resFileUpload.url}` +
        `${uploadFileOCR ? "&ocr=true" : ""}` +
        `${uploadFileOCR && useGCVision ? "&gcvision=true" : ""}`
    );
  };

  const fetchdataSource = async () => {
    try {
      const response = await getFilesUser(user.id);
      //console.log("response", response);
      if (response.status === 200) {
        const data = response.data.data.files;
        const customData = data.map((item, index) => {
          return {
            key: item.keyfile
              ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/${item.keyfile}`
              : item.urlCloudinary,
            name: item.originalname,
            path: item.keyfile
              ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/${item.keyfile}`
              : item.urlCloudinary,
            date: convertToDesiredFormat(item.createdAt),
            ocr: item.ocr ? true : false,
          };
        });
        //console.log("customData", customData);
        setDataSource(customData);
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (openModal) {
      fetchdataSource();
    }
  }, [openModal]);

  const fetchListTitleConversation = async () => {
    try {
      const response = await getListTitleConversation(user.id);
      if (response.status === 200) {
        setTitleConversation(
          response.data.data.conversations.filter(
            (item) => item.urlfile !== null
          )
        );
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchListTitleConversation();
  }, []);

  const handleDeleteConversation = async () => {
    setModalDeleteConversation({
      ...modalDeleteConversation,
      loading: true,
    });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/conversation/delete/${modalDeleteConversation.idConversation}`
      );
      if (response.status === 200) {
        setModalDeleteConversation({
          open: false,
          idConversation: "",
          titleConversation: "",
          loading: false,
        });
        setTitleConversation(
          titleConversation.filter(
            (item) => item.id !== modalDeleteConversation.idConversation
          )
        );
        message.success("Delete conversation successfully!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setModalDeleteConversation({
          open: false,
          idConversation: "",
          titleConversation: "",
          loading: false,
        });
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3>Conversations</h3>
            <p>Chat with documents like pdf, txt, docx and xlsx</p>
          </div>
          <div>
            <Button type="dashed" onClick={() => setOpenModal(true)}>
              <i className="bi bi-chat-square"></i> New chat
            </Button>
          </div>
        </div>

        {titleConversation.length === 0 && (
          <Empty description="No conversation" />
        )}

        {titleConversation.map((item, index) => {
          return (
            <div key={index} className="mt-3">
              <Card
                //loading={loading}
                actions={[
                  <div
                    onClick={() =>
                      navigate(`/conversation/c/${item.id}?url=${item.urlfile}`)
                    }
                    title="Start conversation"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </div>,
                  <div
                    onClick={() => {
                      setModalDeleteConversation({
                        open: true,
                        idConversation: item.id,
                        titleConversation: item.title,
                        loading: false,
                      });
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </div>,
                  <div>
                    <i className="bi bi-three-dots"></i>
                  </div>,
                ]}
                style={{
                  minWidth: 300,
                }}
              >
                <Card.Meta
                  avatar={
                    <i
                      style={{ fontSize: "1.5rem", color: "#bbb" }}
                      className="bi bi-chat-left-fill"
                    ></i>
                  }
                  title={item.title}
                  description={
                    <>
                      <div>{convertToDesiredFormat(item.updatedAt)}</div>
                    </>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
      {/* Modal Start New Conversation */}
      <Modal
        title="Start New Conversation"
        //centered
        open={openModal}
        onOk={() => handleStartConversation()}
        okText="Start conversation"
        okButtonProps={
          resFileUpload.url === "" ? { disabled: true } : { disabled: false }
        }
        onCancel={() => setOpenModal(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1000}
      >
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane
            tab="Documents"
            key="1"
            icon={<i className="bi bi-file-earmark-text"></i>}
          >
            <div>
              {resFileUpload.url && (
                <Button
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    padding: "0px 5px",
                    fontSize: "0.5rem",
                    height: "18px",
                  }}
                  onClick={() => {
                    setResFileUpload({
                      ...resFileUpload,
                      url: "",
                    });
                    setUploadFileOCR(null);
                  }}
                  title="No file selected"
                >
                  <CloseOutlined />
                </Button>
              )}
              <Table
                rowSelection={{
                  type: "radio",
                  selectedRowKeys: [resFileUpload.url],
                  onChange: (selectedRowKeys, selectedRows) => {
                    console.log(
                      // `selectedRowKeys: ${selectedRowKeys}`,
                      "selectedRows: ",
                      selectedRows
                    );
                    setResFileUpload({
                      url: selectedRows[0].path,
                    });
                    setUploadFileOCR(selectedRows[0].ocr); //true hoặc false
                  },
                }}
                columns={[
                  {
                    title: "Name",
                    dataIndex: "name",
                  },
                  {
                    title: "Date",
                    dataIndex: "date",
                  },
                ]}
                dataSource={dataSource}
                pagination={{
                  pageSize: 3,
                  position: ["bottomCenter"],
                }}
              />
              {uploadFileOCR && (
                <div>
                  <Alert
                    style={{
                      marginTop: "10px",
                    }}
                    message={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>Use Google Cloud Vision OCR</span>
                        <div
                          style={{
                            marginLeft: "5px",
                            marginRight: "10px",
                          }}
                        >
                          <Tooltip title="Using Google Cloud Vision OCR accuracy is about 90%">
                            <i className="bi bi-info-circle"></i>
                          </Tooltip>
                        </div>
                        <Switch
                          checked={useGCVision}
                          onChange={(checked) => setUseGCVision(checked)}
                        />
                      </div>
                    }
                    type="info"
                  />
                  <Alert
                    style={{ marginTop: "10px" }}
                    message={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>Use Tesseract OCR</span>
                        <div
                          style={{
                            marginLeft: "5px",
                            marginRight: "10px",
                          }}
                        >
                          <Tooltip title="Using Tesseract OCR accuracy is about 70%">
                            <i className="bi bi-info-circle"></i>
                          </Tooltip>
                        </div>
                        <Switch
                          checked={useTesseract}
                          onChange={(checked) => setUseTesseract(checked)}
                        />
                      </div>
                    }
                    type="warning"
                  />
                </div>
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Upload"
            key="2"
            icon={<i className="bi bi-cloud-arrow-up"></i>}
          >
            <div>
              <Upload.Dragger
                name="file"
                accept=".pdf,.txt,.docx,.xlsx"
                //multiple={true}
                action={apiFileUpload}
                method="POST"
                customRequest={(options) => {
                  //console.log("options", options);
                  const formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("iduser", user.id);
                  axios
                    .post(options.action, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((response) => {
                      //console.log("response customRequest", response);
                      setUploadFileOCR(response.data.ocr ? true : false);
                      options.onSuccess(response.data, options.file);
                    })
                    .catch((error) => {
                      //console.log("error", error);
                      options.onError(error);
                    });
                }}
                maxCount={1}
                onChange={(info) => {
                  //console.log("info", info);
                  const { status } = info.file;
                  if (status === "uploading") {
                    //console.log(info.file, info.fileList);
                    //console.log("status", status);
                    //message.loading("Uploading file...");
                  }
                  if (status === "done") {
                    setApiFileUpload("");
                    setResFileUpload(info.file.response);
                    fetchdataSource();
                    message.success({
                      content: `${info.file.name} file uploaded successfully`,
                      duration: 2,
                    });
                  }
                  if (status === "error") {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    message.error(`${info.file.name} file upload failed`);
                  }
                }}
                beforeUpload={(file) => {
                  //console.log("beforeUpload", file);
                  const allowedFileTypes = [
                    "application/pdf",
                    "text/plain",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  ];
                  const isAllowedFileType = allowedFileTypes.includes(
                    file.type
                  );
                  if (!isAllowedFileType) {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    return message.error({
                      content:
                        "You can only upload PDF, TXT, DOCX, XLSX files!",
                      duration: 3,
                    });
                  }
                  const isLt18M = file.size / 1024 / 1024 < 18;
                  if (!isLt18M) {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    return message.error({
                      content: "File must be smaller than 18MB!",
                      duration: 3,
                    });
                  }
                  //nếu là file pdf, txt thì upload lên server
                  if (
                    file.type === "application/pdf" ||
                    file.type === "text/plain"
                  ) {
                    return setApiFileUpload(
                      `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/upload-system`
                    );
                  }
                  //nếu là file docx, xlsx thì upload lên cloudinary
                  // if (
                  //   file.type ===
                  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  //   file.type ===
                  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  // ) {
                  return setApiFileUpload(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/upload/cloudinary`
                  );
                  // }
                }}
                onRemove={(file) => {
                  setResFileUpload({
                    url: "",
                  });
                }}
              >
                <p className="ant-upload-drag-icon">
                  <i className="bi bi-cloud-arrow-up"></i>
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supported formats: '.pdf', '.txt', '.xlsx', '.docx'
                </p>
              </Upload.Dragger>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Upload with OCR"
            key="3"
            icon={<i className="bi bi-cloud-arrow-up"></i>}
            disabled={uploadFileOCR === false ? true : false}
          >
            <div>
              <Upload.Dragger
                name="file"
                accept=".pdf"
                //multiple={true}
                action={apiFileUpload}
                method="POST"
                customRequest={(options) => {
                  //console.log("options", options);
                  const formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("iduser", user.id);
                  formData.append("ocr", true);
                  axios
                    .post(options.action, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((response) => {
                      //console.log("response", response);
                      options.onSuccess(response.data, options.file);
                    })
                    .catch((error) => {
                      //console.log("error", error);
                      options.onError(error);
                    });
                }}
                maxCount={1}
                onChange={(info) => {
                  //console.log("info", info);
                  const { status } = info.file;
                  if (status === "uploading") {
                    //console.log(info.file, info.fileList);
                    //console.log("status", status);
                    //message.loading("Uploading file...");
                  }
                  if (status === "done") {
                    setApiFileUpload("");
                    setResFileUpload(info.file.response);
                    setUploadFileOCR(true);
                    fetchdataSource();
                    message.success({
                      content: `${info.file.name} file uploaded successfully`,
                      duration: 2,
                    });
                  }
                  if (status === "error") {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    setUploadFileOCR(false);
                    message.error(`${info.file.name} file upload failed`);
                  }
                }}
                beforeUpload={(file) => {
                  //console.log("beforeUpload", file);
                  const allowedFileTypes = ["application/pdf"];
                  const isAllowedFileType = allowedFileTypes.includes(
                    file.type
                  );
                  if (!isAllowedFileType) {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    return message.error({
                      content: "You can only upload PDF",
                      duration: 3,
                    });
                  }
                  const isLt18M = file.size / 1024 / 1024 < 18;
                  if (!isLt18M) {
                    setApiFileUpload("");
                    setResFileUpload({
                      url: "",
                    });
                    return message.error({
                      content: "File must be smaller than 18MB!",
                      duration: 3,
                    });
                  }
                  return setApiFileUpload(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/upload-system`
                  );
                }}
                onRemove={(file) => {
                  setResFileUpload({
                    url: "",
                  });
                  setUploadFileOCR(false);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <i className="bi bi-cloud-arrow-up"></i>
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Supported formats: '.pdf'</p>
              </Upload.Dragger>
              <div>
                <Alert
                  style={{
                    marginTop: "10px",
                  }}
                  message={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>Use Google Cloud Vision OCR</span>
                      <div
                        style={{
                          marginLeft: "5px",
                          marginRight: "10px",
                        }}
                      >
                        <Tooltip title="Using Google Cloud Vision OCR accuracy is about 90%">
                          <i className="bi bi-info-circle"></i>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={useGCVision}
                        onChange={(checked) => setUseGCVision(checked)}
                      />
                    </div>
                  }
                  type="info"
                />
                <Alert
                  style={{ marginTop: "10px" }}
                  message={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>Use Tesseract OCR</span>
                      <div
                        style={{
                          marginLeft: "5px",
                          marginRight: "10px",
                        }}
                      >
                        <Tooltip title="Using Tesseract OCR accuracy is about 70%">
                          <i className="bi bi-info-circle"></i>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={useTesseract}
                        onChange={(checked) => setUseTesseract(checked)}
                      />
                    </div>
                  }
                  type="warning"
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      {/* Modal Delete Conversation */}
      <Modal
        title={
          <>
            <i
              style={{
                color: "rgb(214 0 0)",
                paddingRight: "5px",
              }}
              className="bi bi-trash"
            ></i>{" "}
            Delete conversation
          </>
        }
        centered
        open={modalDeleteConversation.open}
        onOk={() => {
          handleDeleteConversation();
        }}
        onCancel={() => {
          setModalDeleteConversation({
            open: false,
            idConversation: "",
            titleConversation: "",
            loading: false,
          });
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          type: "default",
          danger: true,
          disabled: modalDeleteConversation.loading,
        }}
      >
        <p>
          Do you want to delete this conversation
          <strong
            style={{
              color: "rgb(214 0 0)",
            }}
          >
            {" "}
            {modalDeleteConversation.titleConversation}
          </strong>
        </p>
      </Modal>
    </>
  );
}

export default Index;

import {
  Button,
  Modal,
  Input,
  Typography,
  Row,
  message,
  Upload,
  Switch,
  Tooltip,
  Alert,
  Avatar,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import CKEditorHTML from "@/components/CKEditor";
import { useSelector } from "react-redux";
import { convertFileToText } from "@/utils/convertFileToText";
import PdfToSingleImgToBlob from "@/utils/pdfToSingleImgToBlob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatbot } from "@/services/api/chatbot";
import { GET_ALL_CHATBOT } from "@/services/api/queryKey";

function ModalNewChatbot(props) {
  const { user } = useSelector((state) => state.account);
  const { open, onClose } = props;

  const queryClient = useQueryClient();
  const CKEditorHTMLRef = useRef();

  const [contentNewChatbot, setContentNewChatbot] = useState({
    title: "",
    description: "",
    thumbnail: "",
    html: "",
  });
  const [fileListContent, setFileListContent] = useState([]);
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [showEditorHTML, setShowEditorHTML] = useState(false);
  const [listFileChatbot, setListFileChatbot] = useState([]);

  const [apiFileUpload, setApiFileUpload] = useState("");

  const [uploadFileOCR, setUploadFileOCR] = useState(true);
  const [useEditorChatbot, setUseEditorChatbot] = useState(false);

  // console.log("useEditorChatbot", useEditorChatbot);
  // console.log("showEditorHTML", showEditorHTML);

  const {
    mutate: createChatbotMutation,
    isPending
  } = useMutation({
    mutationFn: createChatbot,
    onSuccess: (data_new) => {
      //key get all chatbot
      //laays data cu va them data moi
      // queryClient.setQueryData([GET_ALL_CHATBOT], (oldData) => {
      //   return {
      //     ...oldData,
      //     data: [...oldData.data, {
      //       id:data_new.data.id,
      //       title: data_new.data.title,
      //       description: data_new.data.description,
      //       thumbnail: data_new.data.thumbnail,
      //       createdAt: data_new.data.createdAt,
      //       updatedAt: data_new.data.updatedAt,
      //     }],
      //   };
      // });
      queryClient.removeQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          //console.log("queryKey", queryKey);
          return queryKey[0] === GET_ALL_CHATBOT;
        }
      });
      handleCancel();
      message.success("Create chatbot success!!!");
    },
    onError: (error) => {
      message.open({
        type: "error",
        content: error.response?.data.message,
        duration: 3,
      });
    },
  });

  const handleOk = async () => {
    if (!contentNewChatbot.title) {
      return message.error("Title is required");
    }
    if (!contentNewChatbot.description) {
      return message.error("Description is required");
    }
    const check_data = CKEditorHTMLRef?.current?.getData((data) => data);
    const check_html = contentNewChatbot.html;
    if ((showEditorHTML || useEditorChatbot) && !check_data) {
      return message.error("Content is required");
    }
    if (!showEditorHTML && !useEditorChatbot && !check_html) {
      return message.error("Content is required");
    }

    if (showEditorHTML) {
      const html = CKEditorHTMLRef?.current?.getData((data) => data);
      //console.log("html file edit", html);
      createChatbotMutation({
        title: contentNewChatbot.title,
        description: contentNewChatbot.description,
        content: html,
        thumbnail: contentNewChatbot.thumbnail,
        iduser: user.id,
        files: listFileChatbot,
      });
      return;
    }
    //default show Editor HTML
    if (useEditorChatbot) {
      const html = CKEditorHTMLRef?.current?.getData((data) => data);
      //console.log("html chatbot", html);
      createChatbotMutation({
        title: contentNewChatbot.title,
        description: contentNewChatbot.description,
        content: html,
        thumbnail: contentNewChatbot.thumbnail,
        iduser: user.id,
        files: listFileChatbot,
      });
      return;
    }

    const html = contentNewChatbot.html;
    //console.log("html file", html);
    createChatbotMutation({
      title: contentNewChatbot.title,
      description: contentNewChatbot.description,
      content: html,
      thumbnail: contentNewChatbot.thumbnail,
      iduser: user.id,
      files: listFileChatbot,
    });
    return;
  };

  const handleCancel = () => {
    setContentNewChatbot({
      name: "",
      description: "",
      thumbnail: "",
      html: "",
    });
    setFileListContent([]);
    setFileListThumbnail([]);
    setListFileChatbot([]);
    setShowEditorHTML(false);
    CKEditorHTMLRef?.current?.clearData();
    onClose();
  };
  //console.log("listFileChatbot", listFileChatbot);
  // console.log("contentNewChatbot", contentNewChatbot);
  return (
    <>
      <Modal
        centered
        title={
          <>
            Chatbot{" "}
            <i style={{ fontSize: "1.2rem" }} className="bi bi-robot"></i>
          </>
        }
        width={1000}
        open={open}
        onOk={handleOk}
        confirmLoading={isPending}
        onCancel={handleCancel}
        okText="Create"
        okButtonProps={{
          disabled: apiFileUpload ? true : false,
        }}
      >
        <div
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <Row>
            <Typography.Title level={5}>Title</Typography.Title>
            <Input
              //placeholder="Chatbot title"
              spellCheck={false}
              showCount
              value={contentNewChatbot.title}
              style={{ width: "40%", margin: "0 10px" }}
              maxLength={80}
              // onKeyDown={
              //   //chỉ chấp nhận kí tự chữ và số
              //   (e) => {
              //     const condition =
              //       (e.key >= "a" && e.key <= "z") ||
              //       (e.key >= "A" && e.key <= "Z") ||
              //       (e.key >= "0" && e.key <= "9") ||
              //       e.key === " " ||
              //       e.key === "_";
              //     if (!condition) {
              //       e.preventDefault();
              //     }
              //   }
              // }
              onChange={(e) => {
                setContentNewChatbot({
                  ...contentNewChatbot,
                  title: e.target.value,
                });
              }}
            />
          </Row>

          <div
            style={{
              marginTop: "10px",
            }}
          />

          <Typography.Title level={5}>Description</Typography.Title>
          <Input.TextArea
            // placeholder="Chatbot Description"
            //style={{ width: "85%", margin: "0 10px" }}
            value={contentNewChatbot.description}
            maxLength={255}
            showCount
            onChange={(e) => {
              setContentNewChatbot({
                ...contentNewChatbot,
                description: e.target.value,
              });
            }}
            spellCheck={false}
          />
          <Row
            style={{
              marginTop: "10px",
            }}
          >
            <Typography.Title style={{ marginRight: "10px" }} level={5}>
              Thumbnail
            </Typography.Title>
            <Upload
              fileList={fileListThumbnail}
              name="file"
              accept=".png,.jpg,.jpeg,.svg"
              action={apiFileUpload}
              method="POST"
              customRequest={(options) => {
                const formData = new FormData();
                formData.append("file", options.file);
                axios
                  .post(options.action, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((response) => {
                    options.onSuccess(response.data, options.file);
                  })
                  .catch((error) => {
                    options.onError(error);
                  });
              }}
              maxCount={1}
              onChange={(info) => {
                const { status } = info.file;
                if (status === "uploading") {
                  //message.loading("Uploading file...");
                }
                if (status === "done") {
                  setApiFileUpload("");
                  setContentNewChatbot({
                    ...contentNewChatbot,
                    thumbnail: info.file.response.url,
                  });
                  setListFileChatbot([
                    ...listFileChatbot,
                    info.file.response.id,
                  ]);
                  return message.success({
                    content: `Upload file ${info.file.name} success`,
                    duration: 2,
                  });
                }
                if (status === "error") {
                  setApiFileUpload("");
                  setContentNewChatbot({
                    ...contentNewChatbot,
                    thumbnail: "",
                  });
                  return message.error({
                    content: `Upload file ${info.file.name} failed`,
                    duration: 2,
                  });
                }
              }}
              beforeUpload={(file) => {
                const allowedFileTypes = [
                  "image/png",
                  "image/jpg",
                  "image/jpeg",
                  "image/svg+xml",
                ];
                const isAllowedFileType = allowedFileTypes.includes(file.type);
                if (!isAllowedFileType) {
                  setApiFileUpload("");
                  setContentNewChatbot({
                    ...contentNewChatbot,
                    thumbnail: "",
                  });
                  return message.error({
                    content: "You can only upload PNG, JPG, JPEG, SVG files!",
                    duration: 3,
                  });
                }
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  setApiFileUpload("");
                  setContentNewChatbot({
                    ...contentNewChatbot,
                    thumbnail: "",
                  });
                  return message.error({
                    content: "File must be smaller than 10MB!",
                    duration: 3,
                  });
                }
                setFileListThumbnail([file]);
                return setApiFileUpload(
                  `${
                    import.meta.env.VITE_BACKEND_URL
                  }/api/v1/file/upload-system`
                );
              }}
              onRemove={(file) => {
                setApiFileUpload("");
                setFileListThumbnail([]);
                setContentNewChatbot({
                  ...contentNewChatbot,
                  thumbnail: "",
                });
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {contentNewChatbot.thumbnail && (
              <div
                style={{
                  marginLeft: "10px",
                  width: "12%",
                }}
              >
                <Image src={contentNewChatbot.thumbnail} />
              </div>
            )}
          </Row>

          <Alert
            style={{
              marginTop: "25px",
            }}
            message={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>Upload with OCR</span>
                <div
                  style={{
                    marginLeft: "5px",
                    marginRight: "10px",
                  }}
                >
                  <Tooltip
                    title={`
                    OCR (Optical Character Recognition) is the recognition of printed or written text characters by a computer
                    `}
                  >
                    <i className="bi bi-info-circle"></i>
                  </Tooltip>
                </div>
                <Switch
                  checked={uploadFileOCR}
                  onChange={(checked) => {
                    if (checked) {
                      setUploadFileOCR(true);
                      setUseEditorChatbot(false);
                    } else {
                      setUploadFileOCR(false);
                      setUseEditorChatbot(false);
                    }
                  }}
                />
              </div>
            }
            type="info"
          />

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
                <span>Use Editor </span>
                <div
                  style={{
                    marginLeft: "5px",
                    marginRight: "10px",
                  }}
                >
                  <Tooltip
                    title={`
                    Use the editor to enter data for the chatbot
                    `}
                  >
                    <i className="bi bi-info-circle"></i>
                  </Tooltip>
                </div>
                <Switch
                  checked={useEditorChatbot}
                  onChange={(checked) => {
                    if (checked) {
                      setUseEditorChatbot(true);
                      setUploadFileOCR(null);
                    } else {
                      setUseEditorChatbot(false);
                      setUploadFileOCR(true);
                    }
                  }}
                />
              </div>
            }
            type="warning"
          />

          <div
            style={{
              marginTop: "20px",
            }}
          >
            {uploadFileOCR === true && (
              <Upload.Dragger
                fileList={fileListContent}
                showUploadList={{
                  showRemoveIcon: false,
                  showPreviewIcon: true,
                  showDownloadIcon: false,
                }}
                disabled={apiFileUpload === "" ? false : true}
                name="file"
                accept=".pdf"
                //multiple={true}
                action={apiFileUpload}
                method="POST"
                customRequest={async (options) => {
                  //console.log("options", options);
                  const fileBlob = await PdfToSingleImgToBlob(options.file);
                  const formData = new FormData();
                  formData.append("file", fileBlob);
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
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: `<div>${contentNewChatbot.html} <br> ${info.file.response.html}</div>`,
                    });
                    setListFileChatbot([
                      ...listFileChatbot,
                      info.file.response.id,
                    ]);
                    message.success({
                      content: `Convert file ${info.file.name} success`,
                      duration: 2,
                    });
                  }
                  if (status === "error") {
                    setApiFileUpload("");
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    message.error(`Convert file ${info.file.name} failed`);
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
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    return message.error({
                      content: "You can only upload PDF",
                      duration: 3,
                    });
                  }
                  const isLt20M = file.size / 1024 / 1024 < 20;
                  if (!isLt20M) {
                    setApiFileUpload("");
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    return message.error({
                      content: "File must be smaller than 20MB!",
                      duration: 3,
                    });
                  }
                  setFileListContent([...fileListContent, file]);
                  return setApiFileUpload(
                    `${
                      import.meta.env.VITE_BACKEND_URL
                    }/api/v1/file/google-cloud-vision`
                  );
                }}
                // onRemove={(file) => {
                //   setApiFileUpload("");
                //   setFileListContent(
                //     fileListContent.filter((item) => item.uid !== file.uid)
                //   );
                //   setContentNewChatbot({
                //     ...contentNewChatbot,
                //     html: "",
                //   });
                // }}
              >
                <p className="ant-upload-drag-icon">
                  <i className="bi bi-cloud-arrow-up"></i>
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Supported formats: '.pdf'</p>
              </Upload.Dragger>
            )}
            {uploadFileOCR === false && (
              <Upload.Dragger
                fileList={fileListContent}
                showUploadList={{
                  showRemoveIcon: false,
                  showPreviewIcon: true,
                  showDownloadIcon: false,
                }}
                name="file"
                accept=".pdf,.txt,.docx,.xlsx"
                //multiple={true}
                action={apiFileUpload}
                method="POST"
                customRequest={(options) => {
                  //console.log("options", options);
                  const formData = new FormData();
                  formData.append("file", options.file);
                  axios
                    .post(options.action, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((response) => {
                      //console.log("response customRequest", response);
                      //setUploadFileOCR(response.data.ocr ? true : false);
                      options.onSuccess(response.data, options.file);
                    })
                    .catch((error) => {
                      //console.log("error", error);
                      options.onError(error);
                    });
                }}
                maxCount={1}
                onChange={async (info) => {
                  //console.log("info", info);
                  const { status } = info.file;
                  if (status === "uploading") {
                    //console.log(info.file, info.fileList);
                    //console.log("status", status);
                    //message.loading("Uploading file...");
                  }
                  if (status === "done") {
                    //console.log("info.file", info.file);

                    if (info.file.type === "application/pdf") {
                      let formData = new FormData();
                      formData.append("file", info.file.originFileObj);
                      const response = await axios.post(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/v1/file/convert-pdf-to-markdown`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                      //console.log("res convert-pdf-to-markdown ", response);
                      setApiFileUpload("");
                      setContentNewChatbot({
                        ...contentNewChatbot,
                        html: `<div>${contentNewChatbot.html} <br> ${response.data.html}</div>`,
                      });
                      setListFileChatbot([
                        ...listFileChatbot,
                        info.file.response.id,
                      ]);
                    } else {
                      const text_file = await convertFileToText({
                        url: info.file.response.url,
                        typefile: info.file.type,
                      });
                      setApiFileUpload("");
                      setContentNewChatbot({
                        ...contentNewChatbot,
                        html: `<div>${contentNewChatbot.html} <br> ${text_file}</div>`,
                      });
                      setListFileChatbot([
                        ...listFileChatbot,
                        info.file.response.id,
                      ]);
                    }
                    message.success({
                      content: `Convert file ${info.file.name} success`,
                      duration: 2,
                    });
                  }
                  if (status === "error") {
                    setApiFileUpload("");
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    message.error(`Convert file ${info.file.name} failed`);
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
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    return message.error({
                      content:
                        "You can only upload PDF, TXT, DOCX, XLSX files!",
                      duration: 3,
                    });
                  }
                  const isLt50M = file.size / 1024 / 1024 < 50;
                  if (!isLt50M) {
                    setApiFileUpload("");
                    setContentNewChatbot({
                      ...contentNewChatbot,
                      html: "",
                    });
                    return message.error({
                      content: "File must be smaller than 50MB!",
                      duration: 3,
                    });
                  }
                  setFileListContent([...fileListContent, file]);
                  return setApiFileUpload(
                    `${
                      import.meta.env.VITE_BACKEND_URL
                    }/api/v1/file/upload-system`
                  );
                }}
                // onRemove={(file) => {
                //   setApiFileUpload("");
                //   setFileListContent([]);
                //   setContentNewChatbot({
                //     ...contentNewChatbot,
                //     html: "",
                //   });
                // }}
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
            )}
            {useEditorChatbot === true && (
              <CKEditorHTML
                ref={CKEditorHTMLRef}
                initialData={contentNewChatbot.html}
              />
            )}
          </div>

          <div
            style={{
              marginTop: "10px",
            }}
          >
            {contentNewChatbot.html && (
              <Button
                type="link"
                onClick={() => setShowEditorHTML(!showEditorHTML)}
              >
                <i className="bi bi-file-text"></i>
                {showEditorHTML ? "Close" : "Content adjustment "}
              </Button>
            )}
            {showEditorHTML && (
              <CKEditorHTML
                ref={CKEditorHTMLRef}
                initialData={contentNewChatbot.html}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalNewChatbot;

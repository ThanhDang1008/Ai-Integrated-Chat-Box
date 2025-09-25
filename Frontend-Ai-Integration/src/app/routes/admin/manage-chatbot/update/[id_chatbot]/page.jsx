import axios from "axios";
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
  FloatButton,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { convertFileToText } from "@/utils/convertFileToText";
import { updateChatbot } from "@/services/api/chatbot";
import PdfToSingleImgToBlob from "@/utils/pdfToSingleImgToBlob";
import { GET_DETAIL_CHATBOT, GET_ALL_CHATBOT } from "@/services/api/queryKey";
import { getDetailChatbot } from "@/services/api/chatbot";
import CKEditorHTML from "@/components/CKEditor";

function UpdateChatbot() {
  const { user } = useSelector((state) => state.account);
  const { id_chatbot } = useParams();
  const navigate = useNavigate();

  const CKEditorHTMLRef = useRef();
  const queryClient = useQueryClient();

  const [contentUpdateChatbot, setContentUpdateChatbot] = useState({
    title: "",
    description: "",
    thumbnail: "",
    html: "",
  });
  const [fileListContent, setFileListContent] = useState([]);
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [listFileChatbotUpdate, setListFileChatbotUpdate] = useState([]);

  const [showEditorHTML, setShowEditorHTML] = useState(false);

  const [apiFileUpload, setApiFileUpload] = useState("");
  const [apiFileUploadThumbnail, setApiFileUploadThumbnail] = useState("");

  const [uploadFileOCR, setUploadFileOCR] = useState(true);

  const {
    data: dataUpdateChatbot,
    isLoading: isLoadingGetDetailChatbot,
    isError: isErrorGetDetailChatbot,
    error: errorGetDetailChatbot,
  } = useQuery({
    queryKey: [GET_DETAIL_CHATBOT, id_chatbot],
    queryFn: () => getDetailChatbot(id_chatbot),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:false, // Only fetch data when 'open' is true
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    //refetchInterval: 3000 * 10 * 60,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (dataUpdateChatbot) {
      let content_parse = JSON.parse(dataUpdateChatbot.data.content);
      let content = content_parse[0].parts[0].text;
      setContentUpdateChatbot({
        title: dataUpdateChatbot.data.title,
        description: dataUpdateChatbot.data.description,
        thumbnail: dataUpdateChatbot.data.thumbnail,
        html: content,
      });
    }
  }, [dataUpdateChatbot]);

  useEffect(() => {
    if (isErrorGetDetailChatbot) {
      message.open({
        type: "error",
        content: errorGetDetailChatbot.response?.data.message,
        duration: 3,
      });
    }
  }, [isErrorGetDetailChatbot, errorGetDetailChatbot]);

  const { mutate: updateChatbotMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: (data) => updateChatbot(data, id_chatbot),
      onSuccess: (data_update) => {
        //console.log("data onSuccess: ", data_update);
        // queryClient.setQueryData([GET_ALL_CHATBOT], (oldData) => {
        //   return {
        //     ...oldData,
        //     data: oldData.data.map((item) => {
        //       if (item.id === id_chatbot) {
        //         return {
        //           id: data_update.data.id,
        //           title: data_update.data.title,
        //           description: data_update.data.description,
        //           thumbnail: data_update.data.thumbnail,
        //           createdAt: data_update.data.createdAt,
        //           updatedAt: item.updatedAt,
        //         };
        //       }
        //       return item;
        //     }),
        //   };
        // });
        queryClient.setQueryData([GET_DETAIL_CHATBOT, id_chatbot], data_update);
        queryClient.removeQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            //console.log("queryKey", queryKey);
            return queryKey[0] === GET_ALL_CHATBOT;
          },
        });
        navigate("/admin/manage-chatbot");
        message.success("Update chatbot success");
      },
      onError: (error) => {
        message.open({
          type: "error",
          content: error.response?.data.message,
          duration: 3,
        });
      },
    });

  const handleUpdateChatbot = async () => {
    if (!contentUpdateChatbot.title) {
      return message.error("Title is required");
    }
    if (!contentUpdateChatbot.description) {
      return message.error("Description is required");
    }
    const html_editor = CKEditorHTMLRef?.current?.getData((data) => data);
    const html = contentUpdateChatbot.html;
    if (showEditorHTML && !html_editor) {
      return message.error("Content is required");
    }
    if (!showEditorHTML && !html) {
      return message.error("Content is required");
    }
    if (showEditorHTML) {
      updateChatbotMutation({
        title: contentUpdateChatbot.title,
        description: contentUpdateChatbot.description,
        content: html_editor,
        thumbnail: contentUpdateChatbot.thumbnail,
        iduser: user.id,
        files: listFileChatbotUpdate,
      });
    }
    if (!showEditorHTML) {
      updateChatbotMutation({
        title: contentUpdateChatbot.title,
        description: contentUpdateChatbot.description,
        content: contentUpdateChatbot.html,
        thumbnail: contentUpdateChatbot.thumbnail,
        iduser: user.id,
        files: listFileChatbotUpdate,
      });
    }
  };

  //console.log("listFileChatbotUpdate", listFileChatbotUpdate);
  //console.log("contentUpdateChatbot", contentUpdateChatbot);
  return (
    <>
      <div
        style={{
          padding: "2% 3%",
        }}
      >
        <Row align={"middle"}>
          <Button type="link" onClick={() => navigate(-1)}>
            <i
              style={{
                fontSize: "20px",
              }}
              className="bi bi-arrow-left"
            ></i>
          </Button>
          <Typography.Title
            style={{
              margin: "0 10px",
              color: "rgb(0 88 158)",
            }}
            level={2}
          >
            Update chatbot
          </Typography.Title>
        </Row>

        <div
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {isErrorGetDetailChatbot && (
            <Alert
              style={{
                marginBottom: "30px",
              }}
              message="Error"
              description={errorGetDetailChatbot.response?.data.message}
              type="error"
              showIcon
            />
          )}
          <Row>
            <Typography.Title level={5}>Title</Typography.Title>
            <Input
              //placeholder="Chatbot title"
              showCount
              value={contentUpdateChatbot?.title}
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
                setContentUpdateChatbot({
                  ...contentUpdateChatbot,
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
            value={contentUpdateChatbot?.description}
            maxLength={255}
            showCount
            onChange={(e) => {
              setContentUpdateChatbot({
                ...contentUpdateChatbot,
                description: e.target.value,
              });
            }}
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
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: false,
                showDownloadIcon: false,
              }}
              accept=".png,.jpg,.jpeg,.svg"
              action={apiFileUploadThumbnail}
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
                  setApiFileUploadThumbnail("");
                  setContentUpdateChatbot({
                    ...contentUpdateChatbot,
                    thumbnail: info.file.response.url,
                  });
                  setListFileChatbotUpdate([
                    ...listFileChatbotUpdate,
                    info.file.response.id,
                  ]);
                  return message.success({
                    content: `Upload file ${info.file.name} success`,
                    duration: 2,
                  });
                }
                if (status === "error") {
                  setApiFileUploadThumbnail("");
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
                  setApiFileUploadThumbnail("");
                  return message.error({
                    content: "You can only upload PNG, JPG, JPEG, SVG files!",
                    duration: 3,
                  });
                }
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  setApiFileUploadThumbnail("");
                  return message.error({
                    content: "File must be smaller than 10MB!",
                    duration: 3,
                  });
                }
                setFileListThumbnail([file]);
                return setApiFileUploadThumbnail(
                  `${
                    import.meta.env.VITE_BACKEND_URL
                  }/api/v1/file/upload-system`
                );
              }}
              // onRemove={(file) => {
              //   setApiFileUploadThumbnail("");
              //   setFileListThumbnail([]);
              // }}
            >
              <Button
                disabled={
                  apiFileUploadThumbnail ||
                  isLoadingGetDetailChatbot ||
                  isErrorGetDetailChatbot ||
                  fileListThumbnail.length === 1
                    ? true
                    : false
                }
                icon={<UploadOutlined />}
              >
                Click to Upload
              </Button>
            </Upload>
            {contentUpdateChatbot.thumbnail && (
              <div
                style={{
                  marginLeft: "10px",
                  width: "12%",
                }}
              >
                <Image src={contentUpdateChatbot.thumbnail} />
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
                  onChange={(checked) => setUploadFileOCR(checked)}
                />
              </div>
            }
            type="info"
          />

          <div
            style={{
              marginTop: "20px",
            }}
          >
            {uploadFileOCR === true && (
              <Upload.Dragger
                fileList={fileListContent}
                disabled={
                  apiFileUpload ||
                  isLoadingGetDetailChatbot ||
                  isErrorGetDetailChatbot
                    ? true
                    : false
                }
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: false,
                  showDownloadIcon: false,
                }}
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
                    setContentUpdateChatbot({
                      ...contentUpdateChatbot,
                      html: `<div>${contentUpdateChatbot.html} <br> ${info.file.response.html}</div>`,
                    });
                    setListFileChatbotUpdate([
                      ...listFileChatbotUpdate,
                      info.file.response.id,
                    ]);
                    message.success({
                      content: `Convert file ${info.file.name} success`,
                      duration: 2,
                    });
                  }
                  if (status === "error") {
                    setApiFileUpload("");
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
                    return message.error({
                      content: "You can only upload PDF",
                      duration: 3,
                    });
                  }
                  const isLt20M = file.size / 1024 / 1024 < 20;
                  if (!isLt20M) {
                    setApiFileUpload("");
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
                //   setFileListContent([]);
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
                disabled={
                  apiFileUpload ||
                  isLoadingGetDetailChatbot ||
                  isErrorGetDetailChatbot
                    ? true
                    : false
                }
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: false,
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
                      setContentUpdateChatbot({
                        ...contentUpdateChatbot,
                        html: `<div>${contentUpdateChatbot.html} <br> ${response.data.html}</div>`,
                      });
                      setListFileChatbotUpdate([
                        ...listFileChatbotUpdate,
                        info.file.response.id,
                      ]);
                    } else {
                      const text_file = await convertFileToText({
                        url: info.file.response.url,
                        typefile: info.file.type,
                      });
                      setApiFileUpload("");
                      setContentUpdateChatbot({
                        ...contentUpdateChatbot,
                        html: `<div>${contentUpdateChatbot.html} <br> ${text_file}</div>`,
                      });
                      setListFileChatbotUpdate([
                        ...listFileChatbotUpdate,
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
                    return message.error({
                      content:
                        "You can only upload PDF, TXT, DOCX, XLSX files!",
                      duration: 3,
                    });
                  }
                  const isLt50M = file.size / 1024 / 1024 < 50;
                  if (!isLt50M) {
                    setApiFileUpload("");
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
            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                type="primary"
                onClick={handleUpdateChatbot}
                loading={isPendingUpdate}
                disabled={
                  isLoadingGetDetailChatbot ||
                  apiFileUpload ||
                  apiFileUploadThumbnail ||
                  isErrorGetDetailChatbot
                }
              >
                Update
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setShowEditorHTML(!showEditorHTML);
                }}
              >
                {showEditorHTML ? "Hide" : "Show"} Editor HTML
              </Button>
            </div>
            {showEditorHTML && (
              <CKEditorHTML
                ref={CKEditorHTMLRef}
                //initialData={contentUpdateChatbot.html}
                data={contentUpdateChatbot?.html}
              />
            )}
          </div>
        </div>
      </div>
      <FloatButton.BackTop
        tooltip="Back to top"
        style={{
          bottom: 18,
          right: 18,
        }}
        type="primary"
      />
    </>
  );
}

export default UpdateChatbot;

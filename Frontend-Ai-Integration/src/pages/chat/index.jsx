import "./chat.scss";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  useParams,
  useOutletContext,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Button,
  Dropdown,
  message,
  Image,
  Space,
  Tooltip,
  Empty,
  Typography,
} from "antd";
import {
  DownloadOutlined,
  LikeOutlined,
  StarOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { formatTime_yy_mm_dd, formatTime_hh_mm_ss } from "@/utils/formatTime";
import {
  createConversation,
  saveConversation,
  getDetailConversation,
} from "@/services/api/conversation";
import ButtonScroll from "./button_scroll";
import PromptTextarea from "./prompt_textarea";
import ModalConfig from "./modal_config";
import ModalDownLoadMessage from "./modal_download_message";
import ModalReport from "./modal_report";

import Gemini_Image from "./images/gemini.png";
import Picture_Loading_Fail from "./images/picture-loading-failed.png";

function Chat() {
  const { user } = useSelector((state) => state.account);
  const { id_chat } = useParams();
  const {
    setRefresh,
    refresh,
    openSidebar,
    setOpenSidebar,
    setInfoConversation,
    infoConversation,
    themeDarkMode,
  } = useOutletContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [conversation, setConversation] = useState([]);
  const [lenConversationSaved, setLenConversationSaved] = useState(0);
  const [messageError, setMessageError] = useState("");

  const fileinput = useRef();
  const chatEndRef = useRef();
  const chatContainer = useRef();
  const inputChat = useRef();
  const modalConfig = useRef();
  const stopAIRunning = useRef();

  let text = "";

  const [disabledSend, setDisabledSend] = useState(false);
  const [file, setFile] = useState({
    url: "",
    type: "",
  });

  const [copyClipboard, setCopyClipboard] = useState({});
  const [messageStream, setResultMessageStream] = useState(null);
  const [aiIsRunning, setAiIsRunning] = useState(false);
  const [imageInineData, setImageInineData] = useState(null);

  const [clickIcon, setClickIcon] = useState({
    like: false,
    star: false,
  });

  const [modalDownLoadMessage, setModalDownLoadMessage] = useState({
    open: false,
    markdown: "",
  });

  const [modalReport, setModalReport] = useState({
    open: false,
  });

  const [isDisabledButtonSend, setDisabledButtonSend] = useState(false);

  const [configModelGemini, setConfigModelGemini] = useState({
    temperature: 1,
    maxOutputTokens: 8192,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
    modelAI: "gemini-1.5-flash",
  });
  //console.log("configModelGemini", configModelGemini);

  useEffect(() => {
    //console.log("location.state", location.state);
    if (location.state?.path === "/chat/gemini/newchat") {
      setInfoConversation({ ...infoConversation, length: conversation.length });
      //reset location.state
      navigate(location.state.path, { state: {} });
    } else if (location.state?.path?.includes("/chat/gemini/conversation-")) {
      setInfoConversation({
        ...infoConversation,
        saved: conversation.length === lenConversationSaved ? true : false,
      });
      //reset location.state
      navigate(location.state.path, { state: {} });
    } else if (location.state?.pathChat === "/chat/gemini/newchat") {
      handleCreateChat();
      //reset location.state
      navigate(location.state.pathChat, { state: {} });
    } else if (
      location.state?.pathChat?.includes("/chat/gemini/conversation-")
    ) {
      handleSaveChat();
      //reset location.state
      navigate(location.state.pathChat, { state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await getDetailConversation(id_chat, user.id);
        //console.log("res", res);
        if (res.status === 200) {
          let conversation_parse = JSON.parse(res.data.data.content);
          //console.log("conversation_replace", conversation_parse);
          setConversation(conversation_parse);
          setLenConversationSaved(conversation_parse.length);
        }
      } catch (error) {
        if (error.response.status === 400) {
          message.error(
            error.response?.data?.message ||
              `Get conversation ${id_chat} failed!`
          );
          setConversation([]);
        }
      }
    };

    if (id_chat && user?.id) {
      setMessageError("");
      getConversation();
    }
    if (!id_chat) {
      setMessageError("");
      setConversation([]);
    }
    //console.log("id_chat", id_chat);
    //setIsShowButtonScroll(false) //fix bug scroll
  }, [id_chat]);

  //Scroll to bottom
  const scrollToBottom = () => {
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Auto scroll to bottom when new message is added
  const autoScrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    //click icon start,like thì ngưng scroll bottom
    if (clickIcon.like === false && clickIcon.star === false) {
      //autoScrollToBottom();
      scrollToBottom();
    }
    setClickIcon({
      like: false,
      star: false,
    });
  }, [conversation]);

  useEffect(() => {
    const Run_Message_Stream = async () => {
      if (messageStream !== null && messageStream !== undefined) {
        stopAIRunning.current = false; // reset flag
        for await (const chunk of messageStream.stream) {
          if (stopAIRunning.current) {
            //console.log("Dừng cập nhật conversation");
            break;
          }
          try {
            const chunkText = chunk.text();
            // console.log("chunkText", chunkText);
            text += chunkText;
            let updateConversation = [...conversation];
            updateConversation[updateConversation.length - 1] = {
              role: "model",
              timestamp: Date.now(),
              parts: [{ text: text }],
            };
            setConversation(updateConversation);
          } catch (error) {
            // console.log(
            //   "Error in message stream:",
            //   error,
            //   "error.message",
            //   error.message,
            //   "error.stack",
            //   error.stack,
            //   "error.name,",
            //   error.name,
            //   "error.response",
            //   error.response
            // );
            setMessageError(
              "Error! An error occurred. Please try again later."
            );
            let updateConversation = [...conversation];
            updateConversation[updateConversation.length - 1] = {
              role: "model",
              timestamp: Date.now(),
              parts: [{ text: error.message }],
            };
            setConversation(updateConversation);
            // Handle the error and update the conversation accordingly
          }
        }
      }
    };
    Run_Message_Stream();
  }, [messageStream]);

  useEffect(() => {
    let timer;
    if (aiIsRunning) {
      timer = setTimeout(() => {
        //console.log("Text không thay đổi trong n giây");
        stopAIRunning.current = true;
        setAiIsRunning(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [conversation]);
  //console.log("aiIsRunning", aiIsRunning);

  // Google generative AI
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: configModelGemini.modelAI,
    //model: "gemini-1.5-pro",
  });

  //gemini-1.5-pro
  //gemini-1.5-flash
  //gemini-1.0-pro

  // Convert file to generative part
  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const generationConfig = {
    temperature: configModelGemini.temperature,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: configModelGemini.maxOutputTokens,
    responseMimeType: "text/plain",
    //candidateCount: number;
    //stopSequences: ["\n \n \n"],
    //responseSchema: ResponseSchema;
  };

  //History chat
  const historychat = conversation.map((item) => {
    const { file, timestamp, star, like, ...rest } = item;
    return rest;
  });
  const chat = model.startChat({
    history: historychat, //loại bỏ url
    generationConfig,
    safetySettings: configModelGemini.safetySettings,
    // systemInstruction: [
    //   "Please write a response to the following message.",
    // ],
  });
  //console.log("historychat", historychat);

  //Chat
  const run = async (text_run_message, data_file) => {
    const messageContent = inputChat.current?.getPromptText();
    const option_1_sendMessageStream = imageInineData
      ? [messageContent, imageInineData]
      : messageContent;
    const option_2_sendMessageStream = data_file
      ? [text_run_message, data_file]
      : text_run_message;
    // console.log("option_1_sendMessageStream", option_1_sendMessageStream);
    // console.log("option_2_sendMessageStream", option_2_sendMessageStream);

    const option_final = option_1_sendMessageStream
      ? option_1_sendMessageStream
      : option_2_sendMessageStream;

    // console.log("option_final", option_final);

    let result;
    try {
      result = await chat.sendMessageStream(option_final);
      //console.log("result", result);
    } catch (error) {
      console.log("error sendMessageStream: ", error);
      setMessageError("Error! An error occurred. Please try again later.");
      let updateConversation = [...conversation];
      updateConversation[updateConversation.length - 1] = {
        role: "model",
        timestamp: Date.now(),
        parts: [{ text: error.message }],
      };
      setConversation(updateConversation);
    }

    //console.log("result", result);
    setResultMessageStream(result);

    const history = await chat.getHistory();
    // console.log("history", history);--
    //console.log("historychat", historychat);
  };

  const sendMessage = async () => {
    // model.countTokens(inputChat.current?.getPromptText()).then((count) => {
    //   console.log("count token: ", count);
    // });
    setConversation([
      ...conversation,
      {
        role: "user",
        file: {
          url: file.url,
          type: file.type,
        },
        timestamp: Date.now(),
        parts: [
          { text: inputChat.current?.getPromptText() },
          imageInineData !== null
            ? { inlineData: imageInineData?.inlineData }
            : { text: " " },
        ],
      },
      {
        role: "model",
        timestamp: Date.now(),
        parts: [
          {
            text: `<div class="spinner-border text-secondary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`,
          },
        ],
      },
    ]);
    setAiIsRunning(true);
    run();
    fileinput.current.value = "";
    inputChat.current?.clearPromptText();
    inputChat.current?.resetRowTextarea();
    setFile({
      url: "",
      type: "",
    });
    setImageInineData(null);
  };

  //console.log("conversation", conversation);--
  //console.log("inputChat.current?.getPromptText()", inputChat.current?.getPromptText());

  const handleFileUpload = async (file) => {
    //console.log("file", file);
    const acceptedFiles = ["image"];
    if (!acceptedFiles.includes(file.type.split("/")[0])) {
      message.error("File type is not supported! Please upload an image file");
      return;
    }
    //kích thước file < 10MB
    if (file.size > 10 * 1024 * 1024) {
      message.error("File size is too large! Maximum 10MB");
      return;
    }
    setDisabledSend(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/upload-system`,
          formData
        );
      }
      if (res.status === 201) {
        setFile({
          url: res.data.url,
          type: file.type,
        });
        fileToGenerativePart(file).then((inineData) => {
          setImageInineData(inineData);
        });
        setDisabledSend(false);
      }
    } catch (error) {
      setDisabledSend(false);
    }
  };
  //console.log("file", file);

  const handleDeleteFile = () => {
    fileinput.current.value = "";
    setFile({
      url: "",
      type: "",
    });
    setImageInineData(null);
  };

  const handleCopyClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyClipboard((prevState) => ({
          ...prevState,
          [text]: true,
        }));
        setTimeout(() => {
          setCopyClipboard((prevState) => ({
            ...prevState,
            [text]: false,
          }));
        }, 4000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  const handleRegenerate = () => {
    let conversation_copy = [...conversation];
    const text_user =
      conversation_copy[conversation_copy.length - 2].parts[0].text;
    conversation_copy.pop();
    //console.log("regenerate",conversation_copy);
    setConversation([
      ...conversation_copy,
      {
        role: "model",
        parts: [
          {
            text: `<div class="spinner-border text-secondary" role="status">
<span class="visually-hidden">Loading...</span>
</div>`,
          },
        ],
      },
    ]);
    run(`Hãy trả lời lại: ${text_user}`);
  };

  const handleCreateChat = async () => {
    let conversation_filter = conversation.map((item) => {
      return {
        ...item,
        parts: item.parts.filter((part) => !part.inlineData),
      };
    });
    try {
      const response = await createConversation(user.id, conversation_filter);
      //console.log("response create", response);
      if (response.status === 201) {
        message.open({
          type: "success",
          content: "Create conversation success!",
        });
        navigate(`/chat/gemini/${response.data.data.id}`);
        setRefresh(!refresh);
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.open({
          type: "error",
          content: "Create conversation error!",
        });
      }
    }
  };

  const handleSaveChat = async () => {
    if (conversation.length === lenConversationSaved) {
      return message.open({
        type: "warning",
        content: "No new messages to save!",
      });
    }
    let conversation_filter = conversation.map((item) => {
      return {
        ...item,
        parts: item.parts.filter((part) => !part.inlineData),
      };
    });
    try {
      const response = await saveConversation(id_chat, conversation_filter);
      //console.log("response", response);
      if (response.status === 200) {
        message.open({
          type: "success",
          content: "Save conversation success!",
        });
        setLenConversationSaved(conversation.length);
        setRefresh(!refresh);
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.open({
          type: "error",
          content: "Save conversation error!",
        });
      }
    }
  };

  const filePreview = {
    image: (
      <img
        src={file.url}
        alt=""
        className="col-lg-2 col-md-4 col-sm-6 col-8"
        onClick={() => {
          window.open(file.url);
        }}
      />
    ),
    audio: (
      <audio controls className="col-lg-4 col-md-7 col-10">
        <source src={file.url} type="audio/mpeg" />
      </audio>
    ),
    video: (
      <video width="320" height="240" controls>
        <source src={file.url} type="video/mp4" />
      </video>
    ),
  };

  const filePreviewModelUser = (type, url) => {
    const filePreviewModelUser = {
      image: (
        <Image
          src={url}
          alt=""
          //nếu ảnh fail thì hiển thị ảnh mặc định
          fallback={Picture_Loading_Fail}
          width={100}
          //preview={false}
        />
      ),
      audio: (
        <audio controls className="col-lg-7 col-md-10 col-12">
          <source src={url} type="audio/mpeg" />
        </audio>
      ),
      video: (
        <video width="320" height="240" controls>
          <source src={url} type="video/mp4" />
        </video>
      ),
    };
    return filePreviewModelUser[type];
  };

  const handleDisabledButtonSend = (promptText) => {
    //console.log("promptText", promptText);
    if (promptText.trim() === "" || promptText.replace(/\n/g, "") === "") {
      setDisabledButtonSend(true);
    } else {
      setDisabledButtonSend(false);
    }
  };

  return (
    <>
      <div
        className={
          themeDarkMode
            ? "dark_chat_gemini_container"
            : "light_chat_gemini_container"
        }
      >
        {/* ---------------------- Chat content ---------------------- */}
        <div className="container_content_btn_scroll">
          <div ref={chatContainer} className="container_content">
            {conversation.map((entry, index) => (
              <div key={index} className={`container_${entry.role}`}>
                <div className={`${entry.role} my-3 mx-1`}>
                  <h6>
                    {entry.role === "model" && (
                      <img
                        src={Gemini_Image}
                        alt="Gemini"
                        style={{ width: 25, height: 25 }}
                      />
                    )}
                    {entry.role === "user" && "You"}
                  </h6>
                  {entry.parts.map((part, partIndex) => (
                    <span key={partIndex}>
                      {/* <Markdown>{part.text}</Markdown> */}
                      <ReactMarkdown
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const codeContent = String(children).replace(
                              /\n$/,
                              ""
                            );
                            return !inline && match ? (
                              <div style={{ position: "relative" }}>
                                <div
                                  className="model_copy_code"
                                  onClick={() =>
                                    handleCopyClipboard(codeContent)
                                  }
                                  style={{
                                    position: "absolute",
                                    right: 5,
                                    top: 5,
                                    padding: 5,
                                  }}
                                >
                                  {copyClipboard[codeContent] ? (
                                    <>
                                      <i className="bi bi-clipboard-check"></i>{" "}
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-clipboard"></i> Copy
                                      code
                                    </>
                                  )}
                                </div>
                                <SyntaxHighlighter
                                  style={okaidia}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {codeContent}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                        //chấp nhận html trong markdown
                        rehypePlugins={[rehypeRaw]}
                        //chấp nhận table
                        remarkPlugins={[remarkGfm]}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </span>
                  ))}
                  {/* ---------------------- file preview model user ---------------------- */}
                  {entry.file?.url &&
                    entry.file?.type &&
                    filePreviewModelUser(
                      entry.file.type.split("/")[0],
                      entry.file.url
                    )}
                  {entry.role === "model" ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: 10,
                        }}
                      >
                        {!messageError && conversation.length === index + 1 ? (
                          <>
                            <div
                              className="model_item"
                              title="Regenerate"
                              onClick={() => handleRegenerate()}
                            >
                              <i className="bi bi-repeat"></i>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <div
                          className="model_item"
                          onClick={() =>
                            handleCopyClipboard(entry.parts[0].text)
                          }
                          title="Copy text"
                        >
                          {copyClipboard[entry.parts[0].text] ? (
                            <i className="bi bi-clipboard-check"></i>
                          ) : (
                            <i className="bi bi-clipboard"></i>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* ---------------------- time_chat ---------------------- */}
                  <div
                    className="time_chat"
                    style={{
                      color:
                        entry.role === "model"
                          ? themeDarkMode
                            ? "rgb(180 169 169)"
                            : "rgb(100 113 151)"
                          : themeDarkMode //user
                          ? "rgb(44 49 69)"
                          : "rgb(69 69 69)",
                      backgroundColor:
                        entry.role === "model"
                          ? themeDarkMode
                            ? ""
                            : ""
                          : themeDarkMode //user
                          ? "rgb(139 137 184)"
                          : "rgb(198 213 235)",
                    }}
                  >
                    {/* {formatTime_hh_mm_ss(entry.timestamp)} */}

                    <div
                      className={`${
                        entry.role === "user" ? "display_none" : ""
                      }`}
                      // timechat của model
                    >
                      <Space.Compact
                        block
                        style={{
                          gap: 5,
                          display: messageError ? "none" : "flex",
                        }}
                      >
                        <Tooltip title="Like">
                          <Button
                            className={
                              entry.like
                                ? "button_like_active"
                                : ""
                                ? "button_like_active"
                                : ""
                            }
                            icon={<LikeOutlined />}
                            onClick={() => {
                              setClickIcon({
                                ...clickIcon,
                                like: true,
                              });
                              setConversation((prevConversation) => {
                                const enjoyMessage = [...prevConversation];
                                enjoyMessage[index] = {
                                  ...enjoyMessage[index],
                                  like: enjoyMessage[index].like ? false : true,
                                };
                                return enjoyMessage;
                              });
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Dislike">
                          <Button
                            onClick={() => {
                              setModalReport({
                                open: true,
                              });
                            }}
                            icon={<DislikeOutlined />}
                          />
                        </Tooltip>
                        <Tooltip title="Star">
                          <Button
                            className={entry.star ? "button_star_active" : ""}
                            icon={<StarOutlined />}
                            onClick={() => {
                              setClickIcon({
                                ...clickIcon,
                                star: true,
                              });
                              setConversation((prevConversation) => {
                                const starMessage = [...prevConversation];
                                starMessage[index] = {
                                  ...starMessage[index],
                                  star: starMessage[index].star ? false : true,
                                };
                                return starMessage;
                              });
                              //console.log("star", conversation[index]);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Download">
                          <Button
                            onClick={() => {
                              //console.log("MarkDown: ", entry.parts[0].text);
                              setModalDownLoadMessage({
                                open: true,
                                markdown: entry.parts[0].text,
                              });
                            }}
                            icon={<DownloadOutlined />}
                          />
                        </Tooltip>
                      </Space.Compact>
                    </div>
                    <div style={{ marginRight: 5 }}>
                      {formatTime_hh_mm_ss(entry.timestamp)}{" "}
                      {formatTime_yy_mm_dd(entry.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {conversation.length === 0 && (
              <Empty
                //image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                image="https://www.gstatic.com/lamda/images/gemini_wordmark_landing_page_38486af5590c0738b60cd.svg"
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
                imageStyle={{
                  height: 60,
                }}
                description={
                  <Typography.Text
                    style={{
                      color: themeDarkMode ? "rgb(127 145 210)" : "rgb(117 163 218)",
                    }}
                  >
                    {/* Customize <a href="#API">Description</a> */}
                    Chat with Google's AI to start writing, planning, studying,
                    and more
                  </Typography.Text>
                }
              >
                <Button
                  type={themeDarkMode ? "primary" : "link"}
                  onClick={() => {
                    inputChat.current?.focusInput();
                  }} 
                >
                  Start now
                </Button>
              </Empty>
            )}
            <div ref={chatEndRef} />
          </div>
          <ButtonScroll
            target={chatContainer}
            //onClick={scrollToBottom}
            visible={chatEndRef}
            icon={<i className="bi bi-arrow-down-circle-fill"></i>}
          />
        </div>

        {/* ---------------------- Write content ---------------------- */}
        <div
          className={`container_write ${messageError ? "display_none" : ""}`}
        >
          <div className="box_content">
            {/* tránh việc bị lag khi rõ phím */}
            <PromptTextarea
              ref={inputChat}
              onPromptTextChange={(promptText) =>
                handleDisabledButtonSend(promptText)
              }
              //không đc viết actionSend={sendMessage()} vì sẽ gọi hàm ngay lập tức
              actionEnter={sendMessage}
              style={{
                minHeight: 28,
                maxHeight: 300,
              }}
            />
            <div>
              <div className="file_preview">
                {file.url && (
                  <>
                    {filePreview[file.type.split("/")[0]]}
                    <div
                      className="delete_file"
                      onClick={() => handleDeleteFile()}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Dropdown
          //theme dark
          rootClassName="dropdown_menu"
            menu={{
              items: [
                !id_chat &&
                  conversation.length > 0 && {
                    key: "1",
                    label: (
                      <>
                        <i className="bi bi-clipboard-plus"></i> Save
                      </>
                    ),
                    onClick: () => handleCreateChat(),
                  },
                id_chat &&
                  conversation.length > 0 && {
                    key: "1",
                    label: (
                      <>
                        <i className="bi bi-clipboard2-check"></i> Save
                      </>
                    ),
                    onClick: () => handleSaveChat(),
                  },
                {
                  key: "2",
                  label: openSidebar ? (
                    <>
                      <i className="bi bi-layout-sidebar-inset-reverse"></i>{" "}
                      Close sidebar
                    </>
                  ) : (
                    <>
                      <i className="bi bi-layout-sidebar-inset"></i> Open
                      sidebar
                    </>
                  ),
                  onClick: () => {
                    setOpenSidebar(!openSidebar);
                  },
                },
                {
                  key: "3",
                  label: (
                    <>
                      <i className="bi bi-gear"></i> Config
                    </>
                  ),
                  onClick: () => {
                    modalConfig.current?.openModal();
                  },
                },
                {
                  key: "4",
                  //upload file
                  label: (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill"></i> Upload file
                    </>
                  ),
                  onClick: () => {
                    fileinput.current.click();
                  },
                },
              ],
            }}
            placement="topRight"
            style={{
              backgroundColor: "red",
            }}
          >
            <Button>
              <i className="bi bi-three-dots-vertical"></i>
            </Button>
          </Dropdown>

          <label className="button_upload" htmlFor="file-input">
            <i className="bi bi-cloud-arrow-up-fill"></i>
          </label>

          {!aiIsRunning && (
            <button
              className={`button_send ${
                disabledSend || isDisabledButtonSend ? "button_disabled" : ""
              }`}
              onClick={sendMessage}
              disabled={disabledSend || isDisabledButtonSend}
            >
              Send
            </button>
          )}
          {aiIsRunning && (
            <button
              className={`button_send`}
              onClick={() => {
                stopAIRunning.current = true;
                setAiIsRunning(false);
              }}
            >
              Stop
            </button>
          )}
        </div>

        {/* ---------------------- Upload file ---------------------- */}

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          ref={fileinput}
        />
        {/* ---------------------- Handle error ---------------------- */}
        {messageError && (
          <div className="message_error">
            <i className="bi bi-exclamation-triangle-fill"></i> {messageError}{" "}
            <i
              className="bi bi-arrow-repeat"
              title="Reload"
              onClick={() => {
                window.location.reload();
              }}
            ></i>
          </div>
        )}
        <div
          style={{
            display: openSidebar ? "none" : "block",
          }}
          className="button_open_sidebar"
          onClick={() => {
            setOpenSidebar(!openSidebar);
          }}
          title="Open sidebar"
        >
          <i className="bi bi-layout-sidebar-inset"></i>
        </div>
      </div>
      {/* ---------------------- Modal Download ---------------------- */}
      <ModalDownLoadMessage
        open={modalDownLoadMessage.open}
        markdown={modalDownLoadMessage.markdown}
        onClose={() => {
          setModalDownLoadMessage({
            open: false,
            markdown: "",
          });
        }}
      />
      {/* ---------------------- Modal Report ---------------------- */}
      <ModalReport
        open={modalReport.open}
        onClose={() => {
          setModalReport({
            open: false,
          });
        }}
      />
      {/* ---------------------- <ModalConfig ---------------------- /> */}
      <ModalConfig
        ref={modalConfig}
        onOk={() => {
          // console.log(
          //   "getSafetySettings",
          //   modalConfig.current?.getSafetySettings,
          //   "getTemperature",
          //   modalConfig.current?.getTemperature,
          //   "getMaxOutputTokens",
          //   modalConfig.current?.getMaxOutputTokens
          // );
          setConfigModelGemini({
            temperature: modalConfig.current?.getTemperature,
            maxOutputTokens: modalConfig.current?.getMaxOutputTokens,
            safetySettings: modalConfig.current?.getSafetySettings,
            modelAI: modalConfig.current?.getModelAI,
          });
          modalConfig.current?.closeModal();
        }}
      />
    </>
  );
}

export default Chat;

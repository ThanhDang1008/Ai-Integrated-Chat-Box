import React, { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import "./chatbot.scss";
import axios from "axios";
import { Button, Dropdown, message, Image, Space, Tooltip, Alert } from "antd";
import {
  DownloadOutlined,
  LikeOutlined,
  StarOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import { formatTime_yy_mm_dd, formatTime_hh_mm_ss } from "@/utils/formatTime";
import remarkGfm from "remark-gfm";
import ButtonScroll from "./button_scroll";
import PromptTextarea from "./(components)/prompt_textarea";
import ModalConfig from "./(components)/modal_config";
import ModalDownLoadMessage from "./(components)/modal_download_message";
import ModalReport from "./(components)/modal_report";
import FloatButtonChatBot from "./(components)/float_button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDetailChatbot } from "@/services/api/chatbot";
import { GET_DETAIL_CHATBOT } from "@/services/api/queryKey";
import { createConversation } from "@/services/api/conversation";

function ChatBot() {
  const { user } = useSelector((state) => state.account);
  const { id_chatbot } = useParams();

  const [conversation, setConversation] = useState([]);
  //   const [lenConversationSaved, setLenConversationSaved] = useState(0);
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

  const [saveCvnChatbot, setSaveCvnChatbot] = useState(false);

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

  const {
    data: data_chatbot,
    isLoading,
    isError,
    error: error_chatbot,
  } = useQuery({
    queryKey: [GET_DETAIL_CHATBOT, id_chatbot],
    queryFn: () => getDetailChatbot(id_chatbot),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:false, // Only fetch data when 'open' is true
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    //refetchInterval: 3000 * 10 * 60,
    //staleTime: 1000 * 60 * 5, // Dữ liệu sẽ không được fetch lại trong 5 phút
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //console.log("data_chatbot", data_chatbot);
  //console.log("error", error_chatbot);
  useEffect(() => {
    //console.log("data_chatbot_fetch---------------");
    if (data_chatbot) {
      const conversation_parse = JSON.parse(data_chatbot.data.content);
      // console.log("conversation_parse", conversation_parse);
      // setConversation(conversation_parse);
      const content_question = conversation_parse[0].parts[0].text;
      setConversation([
        ...conversation_parse,
        {
          role: "user",
          timestamp: Date.now(),
          parts: [
            {
              text: `Hãy nêu vài **câu hỏi** tôi có thể hỏi bạn từ nội dung sau: ${content_question}`,
            },
          ],
        },
        {
          role: "model",
          timestamp: Date.now(),
          parts: [
            {
              text: `<div class="spinner-border text-info" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`,
            },
          ],
        },
      ]);
      run(
        `Hãy nêu vài **câu hỏi** tôi có thể hỏi bạn từ nội dung sau: ${content_question}`
      );
    }
  }, [data_chatbot]); // Chỉ gọi useEffect khi `data` thay đổi

  useEffect(() => {
    if (isError) {
      message.open({
        type: "error",
        content: "Get data chatbot fail!!!",
        duration: 3,
      });
    }
  }, [isError]);

  //console.log("error", error_chatbot);

  //Scroll to bottom
  const scrollToBottom = () => {
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
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
            //console.log("chunk", chunk);
            text += chunkText;
            let updateConversation = [...conversation];
            updateConversation[updateConversation.length - 1] = {
              role: "model",
              timestamp: Date.now(),
              parts: [{ text: text }],
            };
            setConversation(updateConversation);
            // setConversation([
            //   ...conversation,
            //   {
            //     role: "model",
            //     parts: [{ text: text }],
            //   },
            // ]);
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
      }, 1900);
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
  //console.log("historychat", historychat);--

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
      //console.log("error sendMessageStream: ", error);
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
    //console.log("history", history);--
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
            text: `<div class="spinner-border text-info" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`,
          },
        ],
      },
    ]);
    setAiIsRunning(true);
    run();
    fileinput.current.value = "";
    //setPromptText("");
    inputChat.current?.clearPromptText();
    inputChat.current?.resetRowTextarea();
    setFile({
      url: "",
      type: "",
    });
    setImageInineData(null);
  };

  //console.log("conversation", conversation);
  //console.log("inputChat.current?.getPromptText()", inputChat.current?.getPromptText());

  const handleFileUpload = async (file) => {
    //console.log("file", file);--
    const acceptedFiles = ["image"];
    if (!acceptedFiles.includes(file.type.split("/")[0])) {
      message.error("File type is not supported!");
      return;
    }
    //kích thước file nhỏ hơn 2MB
    if (file.size > 2 * 1024 * 1024) {
      message.error("File size must be less than 2MB!");
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

  const { mutate: saveConversationChatbot, isPending } = useMutation({
    mutationFn: ({ iduser, content, url }) =>
      createConversation(iduser, content, url),
    onSuccess: (data) => {
      setSaveCvnChatbot(true);
      message.success("Save conversation chatbot success!!!");
    },
    onError: (error) => {
      message.open({
        type: "error",
        content: error.response?.data.message,
        duration: 3,
      });
    },
  });

  useEffect(() => {
    if (isPending) {
      message.open({
        type: "loading",
        content: "Saving conversation chatbot...",
        key: "loading_save_conversation_chatbot",
      });
    } else {
      message.destroy("loading_save_conversation_chatbot");
    }
  }, [isPending]);

  const handleCreateChat = async () => {
    let conversation_filter = conversation.map((item) => {
      return {
        ...item,
        parts: item.parts.filter((part) => !part.inlineData),
      };
    });
    //console.log("conversation_filter", conversation_filter);
    const url =
      "https://res.cloudinary.com/dg2awknkk/raw/upload/v1725467996/jmzlvbzrfplbnuwfn7cn.docx";
    saveConversationChatbot({
      iduser: user.id,
      content: conversation_filter,
      url: url,
    });
  };

  const filePreview = {
    image: (
      <img
        src={file.url}
        alt="image"
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

  //console.log("isModalSpaceCompact", isModalSpaceCompact);
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
      <div className="chatbot_container" style={{}}>
        {/* //Chat */}
        <div className="container_content_btn_scroll">
          <div ref={chatContainer} className="container_content">
            {conversation.map((entry, index) => {
              if (index !== 0 && index !== 2) {
                return (
                  <div key={index} className={`container_${entry.role}`}>
                    <div className={`${entry.role} my-3 mx-1`}>
                      <h6>
                        {" "}
                        {entry.role === "model" ? (
                          <>
                            <img
                              src="https://res.cloudinary.com/dg2awknkk/image/upload/v1724346007/qoogb688o45kbir4cp9h.png"
                              alt="Gemini"
                              style={{ width: 25, height: 25 }}
                            />
                            {/* <span>CTUET</span> */}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-fill"></i> You
                          </>
                        )}
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
                                          <i className="bi bi-clipboard"></i>{" "}
                                          Copy code
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
                      {/* file preview model user */}
                      {entry.file?.type &&
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
                            {!messageError &&
                            conversation.length === index + 1 && //chỉ hiện nút regenerate ở model
                            index >= 4 ? (
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
                      {/* time_chat */}
                      <div
                        className="time_chat"
                        style={{
                          color:
                            entry.role === "model"
                              ? "rgb(180 169 169)"
                              : "rgb(69 69 69)",

                          backgroundColor:
                            entry.role === "model"
                              ? "rgb(74 106 155)"
                              : "rgb(160 176 209)",
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
                                      like: enjoyMessage[index].like
                                        ? false
                                        : true,
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
                                className={
                                  entry.star ? "button_star_active" : ""
                                }
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
                                      star: starMessage[index].star
                                        ? false
                                        : true,
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
                );
              }
            })}
            {isLoading && !messageError && (
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {isError && !messageError && (
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    padding: 20,
                    borderRadius: 10,
                    backgroundColor: "rgb(211 211 211 / 70%)",
                    color: "rgb(195 0 0)",
                  }}
                >
                  <h4>Error</h4>
                  <p>
                    {error_chatbot.response.data
                      ? error_chatbot.response.data.message
                      : "Unable to connent server!!!"}
                  </p>
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Please try again later
                    <i
                      className="bi bi-arrow-repeat"
                      title="Reload"
                      style={{
                        cursor: "pointer",
                        marginLeft: 5,
                        padding: 5,
                        lineHeight: 1,
                      }}
                      onClick={() => {
                        window.location.reload();
                      }}
                    ></i>
                  </div>
                </div>
              </div>
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

        {/* //Write */}
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
                backgroundColor: "rgb(36 36 36 / 0%)",
                color: "rgb(0 55 89)",
                minHeight: 22,
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
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <>
                      <i className="bi bi-gear"></i> Config
                    </>
                  ),
                  onClick: () => {
                    modalConfig.current?.openModal();
                  },
                },
                conversation.length >= 5 &&
                  !saveCvnChatbot && {
                    key: "2",
                    label: (
                      <>
                        <i className="bi bi-box-arrow-in-down"></i> Save
                      </>
                    ),
                    onClick: () => {
                      handleCreateChat();
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
              {disabledSend || isDisabledButtonSend ? (
                <i className="bi bi-moon-stars"></i>
              ) : (
                <i className="bi bi-cursor-fill"></i>
              )}
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
              <i className="bi bi-stop-fill"></i>
            </button>
          )}
        </div>

        {/* Upload file */}
        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          ref={fileinput}
        />

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

        <FloatButtonChatBot />
      </div>
      {/* Modal Download */}
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
      {/* Modal Report */}
      <ModalReport
        open={modalReport.open}
        onClose={() => {
          setModalReport({
            open: false,
          });
        }}
      />
      {/* <ModalConfig /> */}
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

export default ChatBot;

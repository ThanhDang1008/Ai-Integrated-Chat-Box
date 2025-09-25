import React, { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import "./chatwithfile.scss";
import axios from "axios";
import { Button, Dropdown, message, Image, notification } from "antd";
import { useSelector } from "react-redux";
import {
  createConversation,
  saveConversation,
  getDetailConversation,
} from "../../services/api/conversation";
import {
  useParams,
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import rehypeRaw from "rehype-raw";
import { convertFileToText } from "../../utils/convertFileToText";
import remarkGfm from "remark-gfm";
import ButtonScroll from "./button_scroll";
import PromptTextarea from "./prompt_textarea";
import PdfToSingleImgToBase64 from "../../utils/pdfToSingleImgToBase64";
import PdfToSingleImgToBlob from "../../utils/pdfToSingleImgToBlob";
import ModalConfigChatFile from "./modal_config_chat_file";

function ChatWithFile() {
  const { user } = useSelector((state) => state.account);
  const [searchParams] = useSearchParams();
  const { id_conversation } = useParams();
  const navigate = useNavigate();
  const { infoConversation, setInfoConversation } = useOutletContext();

  const [conversation, setConversation] = useState([]);
  const [lenConversationSaved, setLenConversationSaved] = useState(0);
  const [messageError, setMessageError] = useState("");

  const fileinput = useRef();
  const chatEndRef = useRef();
  const chatContainer = useRef();
  const inputChat = useRef();
  const modalConfigChatFile = useRef();
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
  //console.log("configModelGemini with file", configModelGemini);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await getDetailConversation(id_conversation, user?.id);
        //console.log("res", res);
        if (res.status === 200) {
          let conversation_parse = JSON.parse(res.data.data.content);
          //console.log("conversation_replace", conversation_parse);
          setConversation(conversation_parse);
          setLenConversationSaved(conversation_parse.length);
        }
      } catch (error) {
        setMessageError("Conversation not found!");
        message.error(
          error.response?.data?.message ||
            `Get conversation ${id_conversation} failed!`
        );
      }
    };

    const runConversation = async (url, fileExtension) => {
      //fileExtension: .pdf, .docx, .xlsx, .txt
      let fullText = "";

      if (fileExtension !== "pdf") {
        const text_file_convert = await convertFileToText({
          url: url,
          typefile: fileExtension,
        });
        fullText = text_file_convert;
      }

      if (fileExtension === "pdf") {
        const fileBlob = await axios.get(url, { responseType: "blob" });

        const formData = new FormData();
        formData.append("file", fileBlob.data);

        const response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/file/convert-pdf-to-markdown`,
          formData
        );
        fullText = response.data.markdown;
        console.log("response fullText md", fullText);
      }

      const info = await model.countTokens(fullText);

      if (fullText) {
        setConversation([
          {
            role: "user",
            parts: [
              {
                text: `Hãy nêu vài câu hỏi tôi có thể hỏi bạn từ văn bản sau: ${fullText}`,
              },
            ],
          },
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
        setInfoConversation({
          ...infoConversation,
          totalTokens: info.totalTokens,
        });
        run(
          `Hãy nêu vài câu hỏi tôi có thể hỏi bạn từ văn bản sau: ${fullText}`
        );
      } else if (!fullText) {
        return notification.error({
          key: "conversation_error_convert_file",
          message: <p style={{ color: "red" }}>Can't convert file</p>,
          description: (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <p>Please try again or use OCR to convert</p>

              <Button
                type="primary"
                onClick={() => {
                  notification.destroy("conversation_error_convert_file");
                  runConversationWithOCR(url);
                  navigate(`${window.location.pathname}?url=${url}&ocr=true`);
                }}
              >
                Use OCR
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  notification.destroy("conversation_error_convert_file");
                  runConversationWith_OCR_GCVision(url);
                  navigate(
                    `${window.location.pathname}?url=${url}&ocr=true&gcvision=true`
                  );
                }}
              >
                Use OCR Google Cloud Vision
              </Button>
              <Button
                type="default"
                onClick={() => {
                  notification.destroy("conversation_error_convert_file");
                  navigate(`/conversation`);
                }}
              >
                Go back
              </Button>
            </div>
          ),
          placement: "topLeft",
          duration: 0,
        });
      }
    };

    const runConversationWithOCR = async (url) => {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      //console.log("response", response);
      const file = response.data;
      const objInlineData = await PdfToSingleImgToBase64(file);
      console.log("pdfocr objInlineData: ", objInlineData);
      if (objInlineData) {
        setConversation([
          {
            role: "user",
            parts: [
              {
                text: "Hãy nêu vài câu hỏi tôi có thể hỏi bạn: ",
              },
              {
                inlineData: objInlineData.inlineData,
              },
            ],
          },
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
        run("Hãy nêu vài câu hỏi tôi có thể hỏi bạn: ", {
          inlineData: objInlineData.inlineData,
        });
      }
    };

    const runConversationWith_OCR_GCVision = async (url) => {
      //console.log("runConversationWith_OCR_GCVision", url);
      try {
        const response_blob = await axios.get(url, { responseType: "blob" });
        const file = response_blob.data;

        const blob = await PdfToSingleImgToBlob(file);
        console.log("PdfToSingleImgToBlob: ", blob);
        const formData = new FormData();
        formData.append("file", blob);

        const response_file = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/google-cloud-vision`,
          formData
        );
        const fullText = response_file.data.fullText.replace(/\\n/g, "\n");
        console.log("fullText", fullText);

        const info = await model.countTokens(fullText);

        if (fullText) {
          setConversation([
            {
              role: "user",
              parts: [
                {
                  text: `Hãy nêu vài câu hỏi tôi có thể hỏi bạn: ${fullText}`,
                },
              ],
            },
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
          setInfoConversation({
            ...infoConversation,
            totalTokens: info.totalTokens,
          });
          run(`Hãy nêu vài câu hỏi tôi có thể hỏi bạn: ${fullText}`);
        }
      } catch (error) {
        console.log(`runConversationWith_OCR_GCVision: `, error);
      }
    };

    if (id_conversation && user?.id) {
      //console.log("id_conversation !== newchat", id_conversation);
      getConversation();
    }
    if (!id_conversation) {
      const ocr = searchParams.get("ocr");
      //console.log("searchParams ocr", ocr, typeof ocr);

      const gcvision = searchParams.get("gcvision");
      //console.log("searchParams gcvision", gcvision);

      const url = searchParams.get("url");
      const fileName = url.split("/").pop();
      const fileExtension = fileName.split(".").pop();

      // if (ocr === "true") {
      //   if (gcvision === "true") {
      //     runConversationWith_OCR_GCVision(url);
      //   }
      //   runConversationWithOCR(url);
      // } else {
      //   runConversation(url, fileExtension);
      // }

      const RunConversation = {
        true: (url) => {
          if (gcvision === "true") {
            return runConversationWith_OCR_GCVision(url);
          }
          return runConversationWithOCR(url);
        },
      };
      RunConversation[ocr]?.(url) ?? runConversation(url, fileExtension);
    }
    //setShowButton(false); //fix bug scroll
  }, [id_conversation]);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Auto scroll to bottom when new message is added
  const autoScrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
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
    // model: "gemini-1.5-pro"
  });

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

  //History chat
  const historychat = conversation.map((item) => {
    const { file, timestamp, star, like, ...rest } = item;
    return rest;
  });
  const chat = model.startChat({
    history: historychat, //loại bỏ url
    generationConfig,
    safetySettings: configModelGemini.safetySettings,
    //systemInstruction: "Let's convert the following image to text: ",
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
    //  console.log("option_1_sendMessageStream", option_1_sendMessageStream);
    // console.log("option_2_sendMessageStream", option_2_sendMessageStream);

    const option_final = option_1_sendMessageStream
      ? option_1_sendMessageStream
      : option_2_sendMessageStream;

    //  console.log("option_final", option_final);

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
    //console.log("history", history);
    //console.log("historychat", historychat);
  };

  const sendMessage = () => {
    setConversation([
      ...conversation,
      {
        role: "user",
        file: {
          url: file.url,
          type: file.type,
        },
        parts: [
          { text: inputChat.current?.getPromptText() },
          imageInineData !== null
            ? { inlineData: imageInineData?.inlineData }
            : { text: " " },
        ],
      },
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
    setImageInineData(null);
    setAiIsRunning(true);
    run();
    fileinput.current.value = "";
    inputChat.current?.clearPromptText();
    inputChat.current?.resetRowTextarea();
    setFile({
      url: "",
      type: "",
    });
  };

  //console.log("conversation", conversation);
  //console.log("inputChat.current?.getPromptText()", inputChat.current?.getPromptText());

  const handleFileUpload = async (file) => {
    console.log("file", file);
    const acceptedFiles = ["image", "audio", "video"];
    if (!acceptedFiles.includes(file.type.split("/")[0])) {
      message.error("File type is not supported!");
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
    const url = searchParams.get("url");
    try {
      const response = await createConversation(
        user.id,
        conversation_filter,
        url
      );
      //console.log("response", response);
      if (response.status === 201) {
        message.open({
          type: "success",
          content: "Create conversation success!",
        });
        //setRefresh(!refresh);
        navigate(`/conversation/c/${response.data.data.id}?url=${url}`);
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.open({
          type: "error",
          content: "Create conversation error!",
        });
      }
      if (error.response.status === 500) {
        message.open({
          type: "error",
          content: "Server error!",
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
    const url = searchParams.get("url");
    try {
      const response = await saveConversation(
        id_conversation,
        conversation_filter,
        url
      );
      //console.log("response", response);
      if (response.status === 200) {
        message.open({
          type: "success",
          content: "Save conversation success!",
        });
        //setRefresh(!refresh);
        setLenConversationSaved(conversation.length);
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
      <div className="container_chat_with_file">
        <div className="container_content_btn_scroll">
          <div ref={chatContainer} className="container_content">
            {conversation.map((entry, index) => {
              if (index !== 0 && index !== 2) {
                return (
                  <div key={index} className={`container_${entry.role}`}>
                    <div className={`${entry.role} my-3 mx-1`}>
                      <h6>
                        {entry.role === "model" ? (
                          <>
                            <i
                              style={{ fontSize: "1.2rem" }}
                              className="bi bi-filetype-ai"
                            ></i>
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
                            {/* Regenerate model */}
                            {!messageError &&
                            conversation.length === index + 1 && //chỉ hiện regenerate ở message cuối cùng
                            index !== 1 ? (
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
                            {/* Copy text model */}
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
                    </div>
                  </div>
                );
              }
            })}
            {conversation.length === 0 && !messageError && (
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <ButtonScroll
            target={chatContainer}
            visible={chatEndRef}
            icon={<i className="bi bi-arrow-down-circle-fill"></i>}
          />
        </div>

        <div
          className={`container_write ${messageError ? "display_none" : ""}`}
        >
          <div className="box_content">
            <PromptTextarea
              ref={inputChat}
              onPromptTextChange={(promptText) =>
                handleDisabledButtonSend(promptText)
              }
              useEnterSend={infoConversation.isTyping}
              useShiftNewLine={infoConversation.isTyping}
              //không đc viết actionSend={sendMessage()} vì sẽ gọi hàm ngay lập tức
              actionEnter={sendMessage}
              style={{
                //backgroundColor: "#312f2f",
                background: "rgb(35 35 35 / 5%)",
                color: "#fff",
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
                !id_conversation &&
                  conversation.length >= 3 && {
                    key: "1",
                    label: (
                      <>
                        <i className="bi bi-clipboard-plus"></i> Save
                      </>
                    ),
                    onClick: () => handleCreateChat(),
                  },
                id_conversation &&
                  conversation.length >= 3 && {
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
                  label: (
                    <>
                      <i className="bi bi-gear"></i> Config
                    </>
                  ),
                  onClick: () => {
                    modalConfigChatFile.current?.openModal();
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
          {/* <label className="button_upload" htmlFor="file-input">
            <i className="bi bi-cloud-arrow-up-fill"></i>
          </label> */}
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

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*,audio/*,video/*"
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
      </div>
      {/* ModalConfigChatFile */}
      <ModalConfigChatFile
        ref={modalConfigChatFile}
        onOk={() => {
          // console.log(
          //   "getSafetySettings",
          //   modalConfigChatFile.current?.getSafetySettings,
          //   "getTemperature",
          //   modalConfigChatFile.current?.getTemperature,
          //   "getMaxOutputTokens",
          //   modalConfigChatFile.current?.getMaxOutputTokens
          // );
          setConfigModelGemini({
            temperature: modalConfigChatFile.current?.getTemperature,
            maxOutputTokens: modalConfigChatFile.current?.getMaxOutputTokens,
            safetySettings: modalConfigChatFile.current?.getSafetySettings,
            modelAI: modalConfigChatFile.current?.getModelAI,
          });
          modalConfigChatFile.current?.closeModal();
        }}
      />
    </>
  );
}

export default ChatWithFile;

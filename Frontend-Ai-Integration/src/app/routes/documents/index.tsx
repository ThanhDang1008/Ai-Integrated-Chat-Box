import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import "./test.scss";
// import CKEditorHTML from "../../components/CKEditor";
import { io, Socket } from "socket.io-client";

import { socketService } from "@/services/socket/socket.service";

function Documents() {
  const { user } = useSelector((state: any) => state.account);
  //console.log("user", user);
  // useEffect(() => {
  //   const test = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/v1/file/file-1723016863723-594088841.pdf", { responseType: "blob" });
  //       const file = response.data;
  //       const data = await pdfToMarkdownWithOCR(file);
  //       console.log("text pdfocr: ", data);
  //       return data.text.trim();
  //     } catch (error) {
  //       console.log(`Error fetching or processing file`, error);
  //     }
  //   };
  //   test();
  // }, []);

  // useEffect(() => {
  //   const test = async () => {
  //     Tesseract.recognize(
  //       'http://localhost:5000/api/v1/file/file-1723019228285-626874057.png',
  //       'vie',
  //       { logger: m => console.log(m) }
  //     ).then(({ data: { text } }) => {
  //       console.log("text",text);
  //     })
  //   };
  //   test();
  // }, []);

  // useEffect(() => {
  //   const test3 = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/v1/file/file-1723032952835-6221035.pdf", { responseType: "blob" });
  //       const file = response.data;
  //       const blob = await PdfToSingleImgToBase64AndDownload(file);
  //       console.log("blob img",blob)
  //       const formData = new FormData();
  //       formData.append("file", blob);
  //       const response2 = await axios.post("http://localhost:5000/api/v1/file/blob", formData);
  //       console.log("text___",response2.data.fullText.replace(/\\n/g, '\n'))
  //       return
  //     } catch (error) {
  //       console.log(`Error fetching or processing file`, error);
  //     }
  //   }
  //   test3();
  // }, []);

  const content3 = `<div>test data You will not be billed for the first 10 users generated from the Development token endpoint based on the sub (id). By default, the token will generate data for one of the predefined 10 users. However, you can pass your user ids. </div>`;
  const CKEditorHTMLRef = useRef(null);

  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();

  const socketRef = useRef<Socket>();
  const messagesEnd = useRef<HTMLDivElement>(null);

  const host = "http://localhost:3333";

  // useEffect(() => {
  //   socketRef.current = io(host);

  //   socketRef.current.emit("joinRoom", user?.fullname);

  //   socketRef.current.on("getId", (data) => {
  //       console.log("data", data)
  //     setId(data);
  //   }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

  //   socketRef.current.on("sendDataServer", (dataGot) => {
  //     //@ts-ignore
  //     setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
  //     //scrollToBottom()
  //   }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

  //   return () => {
  //       if (socketRef.current) {
  //           socketRef.current.disconnect();
  //       }
  //       // socket.off("getId");
  //       // socket.off("sendDataServer");
  //   };
  // }, []);

  useEffect(() => {
    socketService.connect();
    socketService.getSocket().emit("join_room", "nguyen van a");

    socketService.getSocket().on("receive_message_123456", (data) => {
      console.log("getSocket on", data);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null && socketRef.current) {
      const msg = {
        content: message,
        //id: id,
        nameUser: user?.fullname,
      };
      socketRef.current.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e: any) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        height: "700px",
      }}
      className="documents_container"
    >
      <h1>Documents</h1>
      <p>Welcome {user?.fullName}</p>
      {/* 
      <CKEditorHTML
        ref={CKEditorHTMLRef}
        data={content3}
      />
      <button
        onClick={() => {
          console.log("data dc", (CKEditorHTMLRef?.current as any)?.getData((data: string) => data));
        }}
      >
        Get data document
      </button> */}
      <div className="box-chat">
        <div className="box-chat_message">
          {mess.map((m: any, index) => {
            return (
              <div
                key={index}
                className={`${
                  m.id === id ? "your-message" : "other-people"
                } chat-item`}
              >
                {m.nameUser}: {m.content}
              </div>
            );
          })}
          <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
        </div>

        <div className="send-box">
          <textarea
            value={message}
            onKeyDown={onEnterPress}
            onChange={handleChange}
            placeholder="Nhập tin nhắn ..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Documents;

import { Modal, message, Radio } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

interface ModalDownLoadMessageProps {
  open: boolean;
  onClose: () => void;
  markdown: string;
}

function ModalDownLoadMessage(props:ModalDownLoadMessageProps) {
  const { open, onClose, markdown } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState({
    typeFileDownload: "",
    markdown: "",
  });
  //console.log("downloadMessage", downloadMessage);

  useEffect(() => {
    setDownloadMessage({
      typeFileDownload: "",
      markdown: markdown,
    });
  }, [markdown]);

  const downloadFile = (filename:string) => {
    //console.log("filename", filename);
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/mdToFile/download/${filename}`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  type TypeFileDownload = "pdf" | "docx" | "txt";

  const convertMdToFile = async (markdown:string, typefile:string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/mdToFile/`,
        {
          markdown: markdown,
          typefile: typefile,
        }
      );
      if (response.status === 200) {
        //console.log("response", response);
        const filename = response.data.data.filename;
        downloadFile(filename);
        handleCancelModal();
      }
    } catch (error:any) {
      if (error.response.status === 500) {
        setIsLoading(false);
        message.error(error.response.data.message);
      }
    }
  };

  const handleCancelModal = () => {
    setDownloadMessage({
      typeFileDownload: "",
      markdown: "",
    });
    setIsLoading(false);
    onClose();
  };

  const handleOkModal = async () => {
    const checkTypeFileDownload = downloadMessage.typeFileDownload;
    const checkMarkdown = downloadMessage.markdown;
    if (!checkTypeFileDownload) {
      message.error("Please select type file download");
      return;
    }
    if (!checkMarkdown) {
      message.error("Markdown is empty");
      return;
    }
    setIsLoading(true);
    return await convertMdToFile(
      downloadMessage.markdown,
      downloadMessage.typeFileDownload
    );
  };

  return (
    <>
      <Modal
        title={"Please select file type download"}
        open={open}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={
          downloadMessage.typeFileDownload === ""
            ? { disabled: true }
            : {
                disabled: false,
              }
        }
        confirmLoading={isLoading}
        okText={isLoading ? "Loading..." : "Download"}
        okType="primary"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          Type file download: &nbsp;
          <Radio.Group
            //defaultValue="a"
            buttonStyle="solid"
            onChange={(e) => {
              setDownloadMessage({
                ...downloadMessage,
                typeFileDownload: e.target.value,
              });
            }}
            value={downloadMessage.typeFileDownload}
          >
            <Radio.Button value="pdf">
              <i
                style={{ fontSize: "1.5rem" }}
                className="bi bi-filetype-pdf"
              ></i>
            </Radio.Button>
            <Radio.Button value="docx">
              <i
                style={{ fontSize: "1.5rem" }}
                className="bi bi-filetype-doc"
              ></i>
            </Radio.Button>
            <Radio.Button value="txt">
              <i
                style={{ fontSize: "1.5rem" }}
                className="bi bi-filetype-txt"
              ></i>
            </Radio.Button>
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
}

export default ModalDownLoadMessage;

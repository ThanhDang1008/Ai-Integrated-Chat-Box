import "./sidebar_chat_with_file.scss";
import PdfRenderer from "../../../utils/plugins/pdf";
import MSDocRenderer from "../../../utils/plugins/doc";
import {
  Button,
  Drawer,
  Space,
  Collapse,
  ColorPicker,
  Select,
  Switch,
} from "antd";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
function SideBarChatWithFile(props) {
  const { infoConversation, setSettings, setInfoConversation } = props;
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [colorRgb, setColorRgb] = useState({
    rgb1: "rgb(50 50 50) 11%",
    rgb2: "rgb(1, 9, 23) 89%",
  });
  const [radialGradient, setRadialGradient] = useState({
    shape: "circle",
    size: "",
    position: "center",
  });

  useEffect(() => {
    setSettings({
      backgroundLayout: `radial-gradient(${radialGradient.shape} ${radialGradient.size} 
      at ${radialGradient.position}, ${colorRgb.rgb1}, ${colorRgb.rgb2})`,
    });
  }, [colorRgb.rgb1, colorRgb.rgb2]);

  useEffect(() => {
    setSettings({
      backgroundLayout: `radial-gradient(${radialGradient.shape} ${radialGradient.size} 
      at ${radialGradient.position}, ${colorRgb.rgb1}, ${colorRgb.rgb2})`,
    });
  }, [radialGradient.shape, radialGradient.size, radialGradient.position]);

  //console.log("searchParams: ", searchParams.get("url"));

  const url = searchParams.get("url");
  const fileName = url?.split("/").pop();
  const fileExtension = fileName?.split(".").pop();

  const showDefaultDrawer = () => {
    setSize("default");
    setOpen(true);
  };
  const showLargeDrawer = () => {
    setSize("large");
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="sidebar-chat-with-file">
        {/* <Space>
          <Button type="primary" onClick={showDefaultDrawer}>
            Open Default Size (378px)
          </Button>
          <Button type="primary" onClick={showLargeDrawer}>
            Open Large Size (736px)
          </Button>
        </Space> */}
        <div className="container_chat_with_file">
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Button type="primary" onClick={showLargeDrawer}>
              View document
            </Button>
          </div>
          <Collapse
            defaultActiveKey={["1"]}
            style={{
              color: "white",
            }}
            ghost
          >
            <Collapse.Panel
              header={
                <div
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  <i className="bi bi-info-circle"></i> Info Conversation
                </div>
              }
              key="1"
            >
              <p>Token count: {infoConversation.totalTokens}/1,048,576</p>
              Use Press <strong>Enter</strong> to send message
              <br />
              {/* Use Press <strong>Shift + Enter</strong> to new line
              <br /> */}
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked={infoConversation.isTyping}
                onChange={(checked) => {
                  //console.log("checked: ", checked);
                  setInfoConversation({
                    ...infoConversation,
                    isTyping: checked,
                  });
                }}
              />
              <Button
                style={{
                  marginTop: "20px",
                }}
                block
                onClick={() => {
                  navigate("/conversation");
                }}
              >
                View conversation
              </Button>
            </Collapse.Panel>
            <Collapse.Panel header="Settings" key="2">
              Background Layout
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                }}
              >
                <ColorPicker
                  format="rgb"
                  value={colorRgb.rgb1}
                  onChange={(color) => {
                    console.log("color1: ", color.toRgbString());
                    setColorRgb({
                      ...colorRgb,
                      rgb1: color.toRgbString(),
                    });
                  }}
                />
                <span>RGB 1: {colorRgb.rgb1}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                }}
              >
                <ColorPicker
                  format="rgb"
                  value={colorRgb.rgb2}
                  onChange={(color) => {
                    console.log("color2: ", color.toRgbString());
                    setColorRgb({
                      ...colorRgb,
                      rgb2: color.toRgbString(),
                    });
                  }}
                />
                <span>RGB 2: {colorRgb.rgb2}</span>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  Shape:
                  <Select
                    value={radialGradient.shape}
                    style={{ width: 120 }}
                    size="small"
                    onChange={(value) => {
                      //console.log("shape: ", value);
                      setRadialGradient({
                        ...radialGradient,
                        shape: value,
                      });
                    }}
                  >
                    <Select.Option value="circle">Circle</Select.Option>
                    <Select.Option value="ellipse">Ellipse</Select.Option>
                  </Select>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  Size:
                  <Select
                    value={radialGradient.size}
                    style={{ width: 120 }}
                    size="small"
                    onChange={(value) => {
                      //console.log("size: ", value);
                      setRadialGradient({
                        ...radialGradient,
                        size: value,
                      });
                    }}
                  >
                    <Select.Option value="closest-side">
                      Closest side
                    </Select.Option>
                    <Select.Option value="closest-corner">
                      Closest corner
                    </Select.Option>
                    <Select.Option value="farthest-side">
                      Farthest side
                    </Select.Option>
                    <Select.Option value="farthest-corner">
                      Farthest corner
                    </Select.Option>
                  </Select>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  Position:
                  <Select
                    value={radialGradient.position}
                    style={{ width: 120 }}
                    size="small"
                    onChange={(value) => {
                      //console.log("position: ", value);
                      setRadialGradient({
                        ...radialGradient,
                        position: value,
                      });
                    }}
                  >
                    <Select.Option value="center">Center</Select.Option>
                    <Select.Option value="top">Top</Select.Option>
                    <Select.Option value="bottom">Bottom</Select.Option>
                    <Select.Option value="left">Left</Select.Option>
                    <Select.Option value="right">Right</Select.Option>
                    <Select.Option value="top left">Top left</Select.Option>
                    <Select.Option value="top right">Top right</Select.Option>
                    <Select.Option value="bottom left">
                      Bottom left
                    </Select.Option>
                    <Select.Option value="bottom right">
                      Bottom right
                    </Select.Option>
                    <Select.Option value="center left">
                      Center left
                    </Select.Option>
                    <Select.Option value="center right">
                      Center right
                    </Select.Option>
                    <Select.Option value="center top">Center top</Select.Option>
                    <Select.Option value="center bottom">
                      Center bottom
                    </Select.Option>
                    <Select.Option value="left top">Left top</Select.Option>
                    <Select.Option value="left bottom">
                      Left bottom
                    </Select.Option>
                    <Select.Option value="right top">Right top</Select.Option>
                    <Select.Option value="right bottom">
                      Right bottom
                    </Select.Option>
                  </Select>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setSettings({
                      backgroundLayout: `radial-gradient(circle, rgb(50 50 50) 11%, rgb(1, 9, 23) 89%)`,
                    });
                    setColorRgb({
                      rgb1: "rgb(50 50 50) 11%",
                      rgb2: "rgb(1, 9, 23) 89%",
                    });
                    setRadialGradient({
                      shape: "circle",
                      size: "",
                      position: "center",
                    });
                  }}
                >
                  Default
                </Button>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
      </div>
      <Drawer
        title={`Document Preview`}
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            {/* <Button type="dashed" onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button> */}
          </Space>
        }
      >
        {["doc", "docx", "xls", "xlsx"].includes(fileExtension) && (
          <MSDocRenderer url={url} style={{ width: "100%", height: "100%" }} />
        )}

        {["pdf", "txt"].includes(fileExtension) && (
          <PdfRenderer uri={url} style={{ width: "100%", height: "100%" }} />
        )}
      </Drawer>
    </>
  );
}

export default SideBarChatWithFile;

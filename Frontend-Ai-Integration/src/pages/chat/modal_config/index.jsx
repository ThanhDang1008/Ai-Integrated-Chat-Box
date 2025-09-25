import React, { useState, forwardRef, useImperativeHandle } from "react";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  Button,
  Modal,
  Slider,
  InputNumber,
  Row,
  Col,
  Divider,
  Select,
} from "antd";

function ModalConfig(props, ref) {
  const { onOk } = props;

  useImperativeHandle(ref, () => ({
    getSafetySettings: safetySettings,
    getTemperature: temperature,
    getMaxOutputTokens: maxOutputTokens,
    getModelAI: modelAI,
    openModal: () => {
      setOpenModal(true);
    },
    closeModal: () => {
      setOpenModal(false);
    },
  }));

  const [openModal, setOpenModal] = useState(false);

  const [modelAI, setModelAI] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(1);
  const [maxOutputTokens, setMaxOutputTokens] = useState(8192);
  const [safetySettings, setSafetySettings] = useState([
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
  ]);

  const value_HarmBlockThreshold = {
    0: HarmBlockThreshold.BLOCK_NONE,
    0.4: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    0.8: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    1.2: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  };

  const value_Tooltip = {
    0: "Always show regardless of probability of being harmful",
    0.4: "Block high probability of being harmful",
    0.8: "Block medium or high probability of being harmful",
    1.2: "Block low, medium and high probability of being harmful",
  };

  const onChangeMaxOutputTokens = (value) => {
    if (isNaN(value)) {
      return;
    }
    setMaxOutputTokens(value);
  };

  const onChangeTemperature = (value) => {
    if (isNaN(value)) {
      return;
    }
    setTemperature(value);
  };

  //   console.log(
  //     "check___",
  //     Object.keys(value_HarmBlockThreshold)[
  //       Object.values(value_HarmBlockThreshold).indexOf(
  //         safetySettings[0].threshold
  //       )
  //     ]
  //   );
  //console.log("check___", safetySettings);
  return (
    <>
      <Modal
        title="Advanced settings"
        open={openModal}
        onOk={onOk}
        onCancel={() => {
          setOpenModal(false);
        }}
        centered={true}
      >
        <>
          <div
            style={{
              marginTop: "20px",
            }}
          ></div>
          <Row
            align={
              "middle" /*"middle" | "top" | "bottom" | "stretch" | "baseline"*/
            }
            style={{
              gap: "10px",
            }}
          >
            <span>Model</span>
            <Select
              disabled={false}
              showSearch
              defaultValue={modelAI}
              style={{ width: "40%" }}
              placeholder="Select a model"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => {
                setModelAI(value);
              }}
              options={[
                {
                  value: "gemini-2.0-flash-exp",
                  label: "Gemini 2.0 Flash Exp ✨",
                },
                {
                  value: "gemini-1.5-pro",
                  label: "Gemini 1.5 Pro",
                },
                {
                  value: "gemini-1.5-flash",
                  label: "Gemini 1.5 Flash",
                },
                // {
                //   value: "gemini-1.0-pro",
                //   label: "Gemini 1.0 Pro",
                // },
              ]}
            />
            <Button
              type="default"
              onClick={() => {
                setTemperature(1);
                setMaxOutputTokens(8192);
                setSafetySettings([
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
                ]);
                setModelAI("gemini-2.0-flash-exp");
              }}
              style={{
                display: "block",
              }}
            >
              Reset defaults
            </Button>
          </Row>
          <Divider />
          <Row
            align={"middle"}
            style={{
              gap: "10px",
            }}
          >
            <span>
              <i className="bi bi-thermometer-half"></i> Temperature
            </span>
            <Col span={12}>
              <Slider
                min={0}
                max={2}
                onChange={onChangeTemperature}
                value={typeof temperature === "number" ? temperature : 1}
                step={0.01}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={2}
                style={{
                  margin: "0 16px",
                }}
                step={0.01}
                value={temperature}
                onChange={onChangeTemperature}
              />
            </Col>
          </Row>
          <Row
            align={"middle"}
            style={{
              gap: "10px",
              marginTop: "5px",
            }}
          >
            <span>
              <i className="bi bi-textarea-t"></i> Max output tokens
            </span>
            <Col span={10}>
              <Slider
                min={1}
                max={8192}
                value={
                  typeof maxOutputTokens === "number" ? maxOutputTokens : 8192
                }
                onChange={onChangeMaxOutputTokens}
                step={1}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={8192}
                style={{
                  margin: "0 16px",
                }}
                step={1}
                value={maxOutputTokens}
                onChange={onChangeMaxOutputTokens}
              />
            </Col>
          </Row>
          <Divider />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <b>Safety settings</b>
            <span>
              Adjust how likely you are to see responses that could be harmful.
              Content is blocked based on the probability that it is harmful.
            </span>
          </div>
          <Row
            align={"middle"}
            style={{
              gap: "10px",
            }}
          >
            <span>Harassment</span>
            <Col span={12}>
              <Slider
                min={0}
                max={1.2}
                onChange={(value) => {
                  setSafetySettings((prev) => {
                    return prev.map((item) => {
                      if (
                        item.category === HarmCategory.HARM_CATEGORY_HARASSMENT
                      ) {
                        return {
                          ...item,
                          threshold: value_HarmBlockThreshold[value],
                        };
                      }
                      return item;
                    });
                  });
                }}
                value={
                  //trả về value 0, 0.4, 0.8, 1.2
                  //safetySettings[0].threshold value của value_HarmBlockThreshold
                  //lấy ra key từ value_HarmBlockThreshold
                  Object.keys(value_HarmBlockThreshold)[
                    Object.values(value_HarmBlockThreshold).indexOf(
                      safetySettings[0].threshold
                    )
                  ]
                }
                step={0.4}
                tooltip={{
                  formatter: (value) => {
                    return value_Tooltip[value];
                  },
                }}
              />
            </Col>
          </Row>
          <Row
            align={"middle"}
            style={{
              gap: "10px",
            }}
          >
            <span>Hate</span>
            <Col span={12}>
              <Slider
                min={0}
                max={1.2}
                onChange={(value) => {
                  setSafetySettings((prev) => {
                    return prev.map((item) => {
                      if (
                        item.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH
                      ) {
                        return {
                          ...item,
                          threshold: value_HarmBlockThreshold[value],
                        };
                      }
                      return item;
                    });
                  });
                }}
                value={
                  Object.keys(value_HarmBlockThreshold)[
                    Object.values(value_HarmBlockThreshold).indexOf(
                      safetySettings[1].threshold
                    )
                  ]
                }
                step={0.4}
                tooltip={{
                  formatter: (value) => {
                    return value_Tooltip[value];
                  },
                }}
              />
            </Col>
          </Row>
          <Row
            align={"middle"}
            style={{
              gap: "10px",
            }}
          >
            <span>Sexually Explicit</span>
            <Col span={12}>
              <Slider
                min={0}
                max={1.2}
                onChange={(value) => {
                  setSafetySettings((prev) => {
                    return prev.map((item) => {
                      if (
                        item.category ===
                        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT
                      ) {
                        return {
                          ...item,
                          threshold: value_HarmBlockThreshold[value],
                        };
                      }
                      return item;
                    });
                  });
                }}
                value={
                  Object.keys(value_HarmBlockThreshold)[
                    Object.values(value_HarmBlockThreshold).indexOf(
                      safetySettings[2].threshold
                    )
                  ]
                }
                step={0.4}
                tooltip={{
                  formatter: (value) => {
                    return value_Tooltip[value];
                  },
                }}
              />
            </Col>
          </Row>
          <Row
            align={"middle"}
            style={{
              gap: "10px",
            }}
          >
            <span>Dangerous Content</span>
            <Col span={12}>
              <Slider
                min={0}
                max={1.2}
                onChange={(value) => {
                  setSafetySettings((prev) => {
                    return prev.map((item) => {
                      if (
                        item.category ===
                        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT
                      ) {
                        return {
                          ...item,
                          threshold: value_HarmBlockThreshold[value],
                        };
                      }
                      return item;
                    });
                  });
                }}
                value={
                  Object.keys(value_HarmBlockThreshold)[
                    Object.values(value_HarmBlockThreshold).indexOf(
                      safetySettings[3].threshold
                    )
                  ]
                }
                step={0.4}
                tooltip={{
                  formatter: (value) => {
                    return value_Tooltip[value];
                  },
                }}
              />
            </Col>
          </Row>
          <Divider />
        </>
      </Modal>
    </>
  );
}

export default forwardRef(ModalConfig);

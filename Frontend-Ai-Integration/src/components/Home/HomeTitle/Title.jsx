import React from "react";
import "./Title.scss";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Space } from "antd";
import { Link } from "react-router-dom";

const colors1 = ["#6253E1", "#04BEFE"];
const colors2 = ["#fc6076", "#ff9a44", "#ef9d43", "#e75516"];
const colors3 = ["#40e495", "#30dd8a", "#2bb673"];

const getHoverColors = (colors) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());

const Title = () => {
  return (
    <div className="home_title_container" id="home_title">
      <p className="container_item--title">Fun experience with AI</p>
      <p className="container_item--text">
        It's not just reading anymore, it's a conversation.
        <br />
        Say hello to documents that respond to you! With AskYourAI, your reading
        isn't just simple, it's fun!
      </p>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors1.join(", ")})`,
              colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(
                colors1
              ).join(", ")})`,
              colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
                colors1
              ).join(", ")})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Link to="/conversation">
          <Button type="primary" size="large">
            Start a conversation
          </Button>
        </Link>
      </ConfigProvider>
      <div className="container_item--image">
        <a className="container_item-link" href="">
          {/* note some thing here */}
        </a>
      </div>
    </div>
  );
};

export default Title;

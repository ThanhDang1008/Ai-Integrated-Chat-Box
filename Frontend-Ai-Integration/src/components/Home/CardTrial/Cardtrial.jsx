import React from "react";
import "./Cardtrial.scss";
import { Link,NavLink } from "react-router-dom";

const Cardtrial = () => {
  return (
    <div className="home_cardtrial_container" id="home_cardtrial">
      <div className="card_trial-full">
        <div className="card_trial-list">
          <div className="card_trial-name">Chat for free with AI now</div>
          <div style={{
            position: "relative",
            zIndex: 1,
          }} className="card_trial-title">
            Chat with AI to start writing content, planning, studying and more...
          </div>
          {/* <input
            className="card_trial-button"
            type="button"
            value="Get started"
          >
          </input> */}
          <NavLink to="/chat/gemini/newchat" className="card_trial-button">Get started</NavLink>
          <div className="card_trial-note">No credit card required.</div>
        </div>
{/* 
        <img
          src="https://cdn.prod.website-files.com/632df91dd7c99c0ac992c47b/6560d37e958bacf5defa78f4_cta-logo-standalone-opt.png"
          alt=""
          className="card_trial-img"
        /> */}
      </div>
    </div>
  );
};

export default Cardtrial;

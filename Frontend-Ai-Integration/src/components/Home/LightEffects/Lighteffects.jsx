import React from "react";
import "./Lighteffects.scss";

const Lighteffects = () => {
  return (
    <div className="pyramid">
      <div className="pyramid_full">
        <div className="pyramid_item" style={{ "--i": 0 }}></div>
        <div className="pyramid_item" style={{ "--i": 1 }}></div>
        <div className="pyramid_item" style={{ "--i": 2 }}></div>
        <div className="pyramid_item" style={{ "--i": 3 }}></div>
      </div>
    </div>
  );
};

export default Lighteffects;

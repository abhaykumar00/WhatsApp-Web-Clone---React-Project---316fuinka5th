import React, { useContext, useRef } from "react";
import "./App.css";
import ChatNames from "./container/ChatNames";
import HeaderLeft from "./container/HeaderLeft";
import HeaderRight from "./container/HeaderRight";
import ChatMessage from "./container/ChatMessage";
import { MyContext } from "./App";

function NewApp() {
  const { stylesWidth, displaypartTwoFour } = useContext(MyContext);

  return (
    <div className="container">
      <div
        className="part part1"
        style={stylesWidth ? { display: "none" } : {}}
      >
        <HeaderLeft />
      </div>
      <div
        className="part part2"
        style={displaypartTwoFour ? { display: "none" } : {}}
      >
        <HeaderRight />
      </div>
      <div
        className="part part3"
        style={stylesWidth ? { display: "none" } : {}}
      >
        <ChatNames />
      </div>
      <div
        className="part part4"
        style={displaypartTwoFour ? { display: "none" } : {}}
      >
        <ChatMessage />
      </div>
    </div>
  );
}

export default NewApp;

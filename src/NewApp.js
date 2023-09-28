import React, { useContext, useRef } from "react";
import "./App.css";

import ChatNames from "./container/chatNames/ChatNames";
import HeaderLeft from "./container/headerLeft/HeaderLeft";
import HeaderRight from "./container/headerRight/HeaderRight";
import ChatMessage from "./container/chatMessage/ChatMessage";
import { MyContext } from "./App";

function NewApp() {
  const { stylesWidth, displaypartTwoFour, setNameChat } =
    useContext(MyContext);

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
        onClick={() => {
          setNameChat(false);
        }}
      >
        <HeaderRight />
      </div>
      <div
        className="part part3"
        style={stylesWidth ? { display: "none" } : {}}
        onClick={() => {
          setNameChat(false);
        }}
      >
        <ChatNames />
      </div>
      <div
        className="part part4"
        style={displaypartTwoFour ? { display: "none" } : {}}
        onClick={() => {
          setNameChat(false);
        }}
      >
        <ChatMessage />
      </div>
    </div>
  );
}

export default NewApp;

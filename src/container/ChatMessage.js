import React, { useContext, useRef } from "react";
import "../App.css";
import emojiData from "./emojiData";
import { doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import firestore from "../firebase";
import SentimentSatisfiedTwoToneIcon from "@mui/icons-material/SentimentSatisfiedTwoTone";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SendIcon from "@mui/icons-material/Send";
import { MyContext } from "../App";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
const ChatMessage = () => {
  const inputRef = useRef(null);
  const refScroller = useRef(null);
  const userNameref = useRef();
  const {
    setLastSeen,
    setLastMessage,
    id,
    userName,
    searchMessage,
    setSidebar,
    sidebar,
  } = useContext(MyContext);

  //const newRef = useRef(null);
  // if (newRef.current === null) {
  //   newRef.current = userName;
  //   console.log(userName, "this is person name", newRef);
  // }
  const [inputvalue, setInputValue] = useState("");
  const [fetchValue, setfetchVAlue] = useState([]);
  const [name, setName] = useState("");
  const [imgSrc, setImgSrc] = useState();
  const [check, setCheck] = useState(false);
  const [imogivalue, setImogivalue] = useState(false);

  let time = "";

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  if (userName) {
    if (!userNameref.current) userNameref.current = userName;
  }

  async function handleClick() {
    if (id)
      if (inputvalue) {
        const currentDate = await new Date();
        const a = currentDate.toString();
        const b = a.indexOf("GMT");
        const c = a.substring(0, b + 3);
        time = c;
        setLastSeen(c);
        setInputValue("");
        setLastMessage(inputvalue);
        setCheck(!check);
        setfetchVAlue([
          ...fetchValue,
          {
            name: userNameref.current,
            class: "chatSender",
            message: inputvalue,
            time: time,
          },
        ]);

        const setValueInFirestore = async () => {
          try {
            await setDoc(doc(firestore, "names", id), {
              message: [
                ...fetchValue,
                {
                  name: userNameref.current,
                  class: "chatSender",
                  message: inputvalue,
                  time: time,
                },
              ],
              name: name,
              src: imgSrc,
            });

            console.log("Value set in Firestore abhay");
          } catch (error) {
            console.error("Error setting value in Firestore:", error);
          }
        };

        setValueInFirestore();
      }
  }

  useEffect(() => {
    firestore
      .collection("names")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setName(data.name);
          setImgSrc(data.src);
          // Access the desired value
          const value = data.message;
          setfetchVAlue(value);
          if (value.length > 0) setLastSeen(value[value.length - 1].time);
          else setLastSeen("");
          setLastMessage(value[value.length - 1].message);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const unsubscribe = firestore
      .collection("names")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const value = data.message;
          setfetchVAlue(() => [...value]);
          if (value.length > 0) setLastSeen(value[value.length - 1].time);
          else setLastSeen("");
          if (value && value.length > 0 && value[value.length - 1].message) {
            setLastMessage(value[value.length - 1].message);
          }
        } else {
          console.log("Document not found");
        }
      });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    refScroller.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [fetchValue]);

  return (
    <div className="chatLive">
      {sidebar && (
        <div className="sidebar">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <h6 className="sidebar1">Signout</h6>
          </Link>
        </div>
      )}

      <div className="messageLive">
        {/* <div className="chatReciever">
          <h1>reciever</h1>
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="messageWrapper"
          >
            <p className="p1">this is message</p>
            <p className="p2">23:43:23 GMT</p>
          </div>
        </div> */}
        {imogivalue && (
          <div className="imoji">
            {emojiData.map((emoji, index) => (
              <p
                onClick={() => {
                  setInputValue(inputvalue + emoji.symbol);
                  inputRef.current.focus();
                }}
                key={index}
              >
                {emoji.symbol}
              </p>
            ))}
          </div>
        )}
        {fetchValue.map((value) => (
          <div
            className={
              value.name === userNameref.current ? "chatSender" : "chatReciever"
            }
          >
            <div className="chatSenderPart">
              <h1>{value.name}</h1>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="messageWrapper"
              >
                <p className="p1">{value.message}</p>
                <p className="p2">{value.time}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={refScroller} />
      </div>
      <div className="inputBottomdiv">
        <SentimentSatisfiedTwoToneIcon
          onClick={() => setImogivalue(!imogivalue)}
          sx={{ margin: "10px" }}
        />
        <input
          value={inputvalue}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClick();
          }}
          ref={inputRef}
        />

        {!inputvalue && (
          <MicTwoToneIcon
            sx={{
              margin: "10px",
              flexShrink: 2,
            }}
          />
        )}
        {inputvalue && (
          <SendIcon onClick={handleClick} sx={{ marginTop: "10px" }} />
        )}
      </div>
    </div>
  );
};
export default ChatMessage;

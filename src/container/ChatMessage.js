import React, { useContext, useRef } from "react";
import "../App.css";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import emojiData from "./emojiData";
import { doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import firestore from "../firebase";
import SentimentSatisfiedTwoToneIcon from "@mui/icons-material/SentimentSatisfiedTwoTone";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SendIcon from "@mui/icons-material/Send";
import { MyContext } from "../App";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { storage } from "./firebase";
const ChatMessage = () => {
  const imagesListRef = ref(storage, "images/");
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
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const imageRef = await ref(storage, `images/${file.name + v4()}`);
      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the input value
          }
        });
      });
    }
  };

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
  function openFileSelection() {
    fileInputRef.current.click();
  }
  return (
    <div className="chatLive">
      {sidebar && (
        <div className="sidebar">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <h6 className="sidebar1">Signout</h6>
          </Link>
        </div>
      )}
      <div className="messageLive hider">
        <div>
          <h5>name of your item</h5>
        </div>
        <img src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/256/document-icon.png" />
        <p>No preview Availble</p>
      </div>
      {/* <div className="messageLive">
      
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
      </div> */}
      <div className="inputBottomdiv">
        <SentimentSatisfiedTwoToneIcon
          className="cursor"
          onClick={() => setImogivalue(!imogivalue)}
          sx={{ margin: "10px" }}
        />
        <AttachFileTwoToneIcon
          className="cursor"
          onClick={openFileSelection}
          sx={{ marginTop: "10px", marginRight: "5px" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
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
          <SendIcon
            onClick={handleClick}
            sx={{ marginTop: "10px", paddingRight: "3px" }}
          />
        )}
      </div>
    </div>
  );
};
export default ChatMessage;

import React, { useContext, useRef } from "react";
import "../App.css";
import { v4 } from "uuid";
import { useCallback } from "react";
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
import { hover } from "@testing-library/user-event/dist/hover";

const ChatMessage = () => {
  const imagesListRef = ref(storage, "images/");
  const inputRef = useRef(null);
  const refScroller = useRef(null);
  const userNameref = useRef();
  const fileTypeRef = useRef("");
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
  const [fileType, setFileType] = useState("file");
  const [displayFile, setDisplayFile] = useState(false);
  const [isStop, setIsStop] = useState(false);

  let time = "";
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlOfFile, setUrlOfFile] = useState("");
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setDisplayFile(true);
    console.log("this is console of handle fileChange");
  };
  async function uploadDocs() {
    try {
      if (selectedFile) {
        const imageRef = await ref(
          storage,
          `images/${selectedFile.name + v4()}`
        );
        const snapshot = await uploadBytes(imageRef, selectedFile);
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);
        setUrlOfFile(url);

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the input value
        }
      }
    } catch (error) {
      console.error("Error uploading or retrieving the file:", error);
      // Handle the error here, e.g., show an error message to the user
    }
    setDisplayFile(false);
  }
  if (urlOfFile !== null) handleClick();
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  if (userName) {
    if (!userNameref.current) userNameref.current = userName;
  }

  async function handleClick() {
    console.log("this is urlof file", await urlOfFile);
    if (id || (await urlOfFile))
      if (inputvalue || (await urlOfFile)) {
        const currentDate = await new Date();
        const a = currentDate.toString();
        const b = a.indexOf("GMT");
        const c = a.substring(0, b + 3);
        time = c;
        console.log(time);
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
            urlOfFile: urlOfFile,
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
                  message: inputvalue || "",
                  time: time,
                  urlOfFile: urlOfFile,
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
        setUrlOfFile("");
      }
  }

  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setAudioChunks(chunks);
      };

      recorder.start();
      setIsRecording(true);
      setIsStop(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();

      setIsStop(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  const handleTypeOfFile = useCallback((type) => {
    setFileType(`${type}`);
    console.log(`"${type}"`, "this is type asdjkfh");
  });
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
  {
    console.log(fileTypeRef.current, "this is a file type");
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
      {displayFile && (
        <img
          src="https://openclipart.org/image/2400px/svg_to_png/183568/close-button.png"
          style={{
            width: "40px",
            height: "40px",
            position: "fixed",
            top: "85px",
          }}
          onClick={() => {
            setDisplayFile(false);
            setSelectedFile();
          }}
        />
      )}
      {displayFile && (
        <div className="messageLive hider">
          <div style={{ backgroundColor: "lightgray" }}>
            <h5 className="messageLiveH5">{selectedFile.name}</h5>
          </div>
          <img
            style={{ cursor: "pointer" }}
            src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/256/document-icon.png"
          />
          <p>No preview Availble</p>
        </div>
      )}
      {!displayFile && (
        <div className="messageLive">
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
                value.name === userNameref.current
                  ? "chatSender"
                  : "chatReciever"
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
                  {value.message === "" && (
                    <a
                      href={value.urlOfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={value.urlOfFile}
                        style={{ width: "40px", height: "40px" }}
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={refScroller} />
        </div>
      )}

      {/* {displayFile && (
        <div
          className="documentSenderDiv"
          style={{
            backgroundColor: "white",
            zIndex: "5",
            position: "absolute",
            bottom: "50px",
            left: "50px",
          }}
        >
          <p
            type="audio"
            onClick={() => {
              setDocsInput(false);
              setVideoInput(false);
              setAudioInput(true);
              setImageInput(false);
              fileInputRef.current.click();
            }}
          >
            Audio
          </p>

          <p
            type="video"
            onClick={() => {
              fileTypeRef.current = "video/*";
              setFileType((prev) => "video/*");
              fileInputRef.current.click();
            }}
          >
            Video
          </p>
          <p
            type="pdf"
            onClick={() => {
              setDocsInput(true);
              setVideoInput(false);
              setAudioInput(false);
              setImageInput(false);
            }}
          >
            Document
          </p>
          <p
            type="img"
            onClick={() => {
              fileTypeRef.current = "image/*";

              fileInputRef.current.click();
              handleTypeOfFile("image/*");
            }}
          >
            image
          </p>
        </div>
      )} */}
      {isAudioOn && (
        <div
          style={{
            backgroundColor: "green",
            width: "20px",
            height: "20px",
            zIndex: "10",
            position: "fixed",
            bottom: "100px",
            right: "10px",
          }}
        ></div>
      )}

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
        {/* {setAudioInput && (
          <input
            type="file"
            // accept={valueoffile}
            // accept={fileTypeRef.current}
            accept="audio/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        )}
        {setVideoInput && (
          <input
            type="file"
            // accept={valueoffile}
            // accept={fileTypeRef.current}
            accept="video/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
            )} */}
        <input
          type="file"
          // accept={valueoffile}
          // accept={fileTypeRef.current}
          accept=""
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
        {isRecording && (
          <div
            style={{
              position: "absolute",
              width: "99%",
              height: "40px",
              bottom: "0px",
              left: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: "50",
              backgroundColor: "green",
            }}
          >
            <button
              onClick={() => setIsRecording(false)}
              style={{ fontSize: "" }}
            >
              Cancle
            </button>
            <div>
              {isStop && (
                <button onClick={isRecording ? stopRecording : startRecording}>
                  Stop
                </button>
              )}
              <button>Send</button>
            </div>
          </div>
        )}
        {!inputvalue && inputvalue && (
          <MicTwoToneIcon
            sx={{
              margin: "10px",
              flexShrink: 2,
            }}
            onClick={isRecording ? stopRecording : startRecording}
          />
        )}
        {inputvalue && !displayFile && (
          <SendIcon
            onClick={handleClick}
            sx={{ marginTop: "10px", paddingRight: "3px" }}
          />
        )}
        {displayFile && (
          <SendIcon
            onClick={uploadDocs}
            sx={{ marginTop: "10px", paddingRight: "3px" }}
          />
        )}
      </div>

      {/* {audioChunks.length > 0 && (
        <audio controls>
          <source
            src={URL.createObjectURL(
              new Blob(audioChunks, { type: "audio/wav" })
            )}
          />
        </audio>
      )} */}
    </div>
  );
};
export default ChatMessage;

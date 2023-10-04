import React, { useContext, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./chatMessage.css";
import { v4 } from "uuid";
import { useCallback } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import emojiData from ".././emojiData";
import { doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import firestore from "../../firebase";
import SentimentSatisfiedTwoToneIcon from "@mui/icons-material/SentimentSatisfiedTwoTone";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SendIcon from "@mui/icons-material/Send";
import { MyContext } from "../../App";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { storage } from ".././firebase";
import firebaseApiCall from "../../Functions/FirebaseApiCall";
import deleteFirestoreDocumentById from "../../Functions/delete";
import GroupInfo from "../GroupInfo";
import setVisibilityForGroup from "../../Functions/Visibility";
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
    setHeaderName,
    setSidebar,
    sidebar,
    email,
    setNameChat,
    globalAllGmail,
    slider2,
    setSlider2,
    setGroupLogo,
    groupLogo,
    groupInfo,
    setGroupInfo,
    setDisplayMiddleSlider,
  } = useContext(MyContext);

  //const newRef = useRef(null);
  // if (newRef.current === null) {
  //   newRef.current = userName;
  //   console.log(userName, "this is person name", newRef);
  // }
  const [adminName, setAdminName] = useState("");
  const [inputvalue, setInputValue] = useState("");
  const [fetchValue, setfetchVAlue] = useState([]);
  const [name, setName] = useState("");
  const [imgSrc, setImgSrc] = useState();
  const [check, setCheck] = useState(false);
  const [imogivalue, setImogivalue] = useState(false);
  const [fileType, setFileType] = useState("file");
  const [displayFile, setDisplayFile] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [visible, setVisibil] = useState([]);

  let time = "";
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlOfFile, setUrlOfFile] = useState(null);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setDisplayFile(true);
  };
  async function uploadDocs() {
    setImogivalue(false);
    try {
      if (selectedFile) {
        const imageRef = await ref(
          storage,
          `images/${selectedFile.name + v4()}`
        );
        const snapshot = await uploadBytes(imageRef, selectedFile);
        const url = await getDownloadURL(snapshot.ref);

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
  if (urlOfFile !== null) {
    setImogivalue(false);

    handleClick();
  }
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  if (userName) {
    if (!userNameref.current) userNameref.current = userName;
  }

  async function handleClick() {
    setImogivalue(false);

    if ((id || (await urlOfFile)) && !displayFile) {
      if (inputvalue || (await urlOfFile)) {
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
            urlOfFile: urlOfFile,
          },
        ]);

        const setValueInFirestore = async () => {
          if (localStorage.getItem("type") === "all") {
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
                type: localStorage.getItem("type"),
                adminName: adminName,
                visibility: [...visible],
              });

              console.log("Value set in Firestore abhay");
            } catch (error) {
              console.error("Error setting value in Firestore:", error);
            }
          } else if (localStorage.getItem("type") === "personal") {
            const newValue = JSON.parse(localStorage.getItem("gmailNameObj"));

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
                name1: newValue.name1,
                name2: newValue.name2,
                gmail1: newValue.gmail1,
                gmail2: newValue.gmail2,
                src1: newValue.src1,
                src2: newValue.src2,
                type: localStorage.getItem("type"),
              });

              console.log("Value set in Firestore abhay");
            } catch (error) {
              console.error("Error setting value in Firestore:", error);
            }
          }
        };

        setValueInFirestore();
        setUrlOfFile(null);
      }
    } else if (displayFile) {
      uploadDocs();
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

          localStorage.setItem("myObject", JSON.stringify({ data, id }));
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
          setVisibil(data.visibility);

          const value = data.message;
          setAdminName(data.adminName);
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
    <div
      className="chatLive"
      onClick={() => {
        if (slider2) setSlider2(false);
        setNameChat(false);
        setDisplayMiddleSlider(false);
      }}
    >
      {slider2 && (
        <div className="sidebarChild">
          {globalAllGmail.map((val) => (
            <div
              className="sidebarChildDiv"
              onClick={() => {
                setVisibilityForGroup({
                  email: val.gmail,
                  id,
                });
                setSlider2(false);
              }}
              key={val.gmail}
            >
              <p className="sidebarChildP">{val.name}</p>
              <h6 className="sidebarChildh6">{val.gmail}</h6>
            </div>
          ))}
        </div>
      )}
      {sidebar && (
        <div className="sidebar">
          {/* <Link to="/" className="sidebarLink">
            <h6 className="sidebar1">Signout</h6>
          </Link> */}
          {adminName === email && (
            <Link to="/home" className="sidebarLinkAnother">
              <p
                className="sidebar1Link sidebar1"
                onClick={() => {
                  setSidebar(false);

                  deleteFirestoreDocumentById({
                    id,
                    setHeaderName,
                    setLastSeen,
                    setfetchVAlue,
                    setGroupLogo,
                  });
                }}
              >
                Delete Group
              </p>
            </Link>
          )}
          {/* {adminName === email && ( */}

          {/* / /<p */}
          {/* //   onClick={() => { */}
          {/* //     setSlider2(!slider2);
            //   }}
            //   className="sidebar1"
            // >
            //   add member
            // </p> */}
          {/* // )} */}
          {id && (
            <p
              onClick={() => {
                setGroupInfo(true);
              }}
              className="sidebar1"
            >
              Group info
            </p>
          )}
        </div>
      )}
      {displayFile && (
        <img
          className="displayFileImag"
          src="https://openclipart.org/image/2400px/svg_to_png/183568/close-button.png"
          onClick={() => {
            setDisplayFile(false);
            setSelectedFile();
            setSidebar(false);
          }}
        />
      )}
      {groupInfo && (
        <div className="groupInfo">
          <GroupInfo
            adminName={adminName}
            globalAllGmail={globalAllGmail}
            visible={visible}
            id={id}
            setGroupInfo={setGroupInfo}
            email={email}
            groupLogo={groupLogo}
          />
        </div>
      )}
      {displayFile && (
        <div className="messageLive hider" onClick={() => setSidebar(false)}>
          <div className="messageLiveDiv">
            <h5 className="messageLiveH5">{selectedFile.name}</h5>
          </div>
          <img
            className="messageLiveImg"
            src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/256/document-icon.png"
          />
          <p className="messageLiveP">No preview Availble</p>
        </div>
      )}
      {!displayFile && (
        <div className="messageLive" onClick={() => setSidebar(false)}>
          {imogivalue && (
            <div className="imoji">
              {emojiData.map((emoji, index) => (
                <p
                  className="imojiP"
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
                <h1 className="chatSenderPartH1">{value.name}</h1>
                <div className="messageWrapper">
                  {value.urlOfFile && (
                    <a
                      href={value.urlOfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="messageWrapper-img"
                        src={value.urlOfFile}
                      />
                    </a>
                  )}
                  <p className="p1">{value.message}</p>
                  <p className="p2">{value.time}</p>
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
      {isAudioOn && <div></div>}

      <div className="inputBottomdiv">
        <SentimentSatisfiedTwoToneIcon
          className="cursor SentimentSatisfiedTwoToneIcon"
          onClick={() => setImogivalue(!imogivalue)}
        />
        <AttachFileTwoToneIcon
          className="cursor AttachFileTwoToneIcon"
          onClick={openFileSelection}
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
          className="inputFile"
          type="file"
          // accept={valueoffile}
          // accept={fileTypeRef.current}
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <input
          value={inputvalue}
          onChange={handleChange}
          className="inputMessage"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setImogivalue(false);
              handleClick();
            }
          }}
          ref={inputRef}
        />
        {isRecording && (
          <div className="recording">
            <button onClick={() => setIsRecording(false)}>Cancle</button>
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
            className="micTwoOneIcon"
            onClick={isRecording ? stopRecording : startRecording}
          />
        )}
        {inputvalue && !displayFile && (
          <SendIcon className="sendIcon" onClick={handleClick} />
        )}
        {displayFile && <SendIcon className="sendIcon" onClick={uploadDocs} />}
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

import React, { useRef, useEffect, createContext, useContext } from "react";
import NewApp from "./NewApp";
import { Routes, Route } from "react-router-dom";
import Google from "./Google";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
export const MyContext = createContext();

function App() {
  const newRef = useRef();

  const location = useLocation();
  const { userPhotoUrl, emailName } = location.state ?? {
    userPhotoUrl: "p",
    // if(userPhotoUrl.indexOf("http")!==-1 &&
  };
  const [sidebarchild, setSidebarChild] = useState(false);
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [headerName, setHeaderName] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [id, setId] = useState();
  const [lastMessage, setLastMessage] = useState("");
  const [nameId, setNameId] = useState([]);
  const [stylesWidth, setStyleWidth] = useState(false);
  const [displaypartTwoFour, setDisplayPartTwoFour] = useState(true);
  const [part2Active, setPart2Active] = useState(false);
  const userRef = useRef(false);
  const [groupLogo, setGroupLogo] = useState("");
  const [searchMessage, setSearchMessage] = useState();
  const [sidebar, setSidebar] = useState(false);
  const [newFetchValue, setNewFetchValue] = useState([]);
  const [nameUpdate, setNameUpdate] = useState(false);
  const [globalAllGmail, setGlobalAllGmail] = useState([]);
  const [slider2, setSlider2] = useState(false);
  const [nameChat, setNameChat] = useState(false);
  const [groupInfo, setGroupInfo] = useState(false);
  const [displayForGroup, setDisplayForGroup] = useState(false);
  const [displayMiddleSlider, setDisplayMiddleSlider] = useState(false);
  if (email === "") setEmail(emailName);
  return (
    <>
      <MyContext.Provider
        value={{
          groupInfo,
          setGroupInfo,
          slider2,
          setSlider2,
          sidebarchild,
          setSidebarChild,
          setSearchMessage,
          searchMessage,
          lastSeen,
          lastMessage,
          setLastMessage,
          setLastSeen,
          nameId,
          setNameId,
          userPhotoUrl,
          setId,
          id,
          setHeaderName,
          headerName,
          setStyleWidth,
          stylesWidth,
          displaypartTwoFour,
          setDisplayPartTwoFour,
          part2Active,
          setPart2Active,
          userRef,
          newRef,
          userName,
          setUsername,
          setGroupLogo,
          groupLogo,
          sidebar,
          setSidebar,
          newFetchValue,
          setNewFetchValue,
          nameUpdate,
          setNameUpdate,
          email,
          setEmail,
          globalAllGmail,
          setGlobalAllGmail,
          nameChat,
          setNameChat,
          displayForGroup,
          setDisplayForGroup,
          displayMiddleSlider,
          setDisplayMiddleSlider,
        }}
      >
        <Routes>
          <Route path="/" element={<Google />} />
          <Route path="/home" element={<NewApp />} />
          {nameId.map((nam) => (
            <Route path={"/" + nam.id} element={<NewApp />} />
          ))}
        </Routes>
      </MyContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;

import React, { useRef, useEffect, createContext, useContext } from "react";
import NewApp from "./NewApp";
import { Routes, Route } from "react-router-dom";
import Google from "./Google";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export const MyContext = createContext();

function App() {
  const newRef = useRef();

  const location = useLocation();
  const { userPhotoUrl, userName } = location.state ?? {
    userPhotoUrl: "A",
    // if(userPhotoUrl.indexOf("http")!==-1 &&
  };

  const [headerName, setHeaderName] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [id, setId] = useState();
  const [lastMessage, setLastMessage] = useState("");
  const [nameId, setNameId] = useState([]);
  const [stylesWidth, setStyleWidth] = useState(false);
  const [displaypartTwoFour, setDisplayPartTwoFour] = useState(true);
  const [part2Active, setPart2Active] = useState(false);
  const userRef = useRef(false);

  return (
    <>
      <MyContext.Provider
        value={{
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
    </>
  );
}

export default App;

import React, { useContext, useRef, useState } from "react";

import "./headerRight.css";
import Avatar from "@mui/material/Avatar";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MyContext } from "../../App";

const HeaderRight = () => {
  const {
    setSearchMessage,
    lastSeen,
    headerName,
    stylesWidth,
    setStyleWidth,
    setDisplayPartTwoFour,
    userRef,
    groupLogo,
    setSidebar,
    sidebar,
    sidebarchild,
    setSidebarChild,
    setSlider2,
    slider2,
  } = useContext(MyContext);

  const retrievedObject = JSON.parse(localStorage.getItem("myObject"));
  console.log(retrievedObject, "line 25 in header right");
  const windowWidth = window.innerWidth;
  if (windowWidth > 600) {
    setStyleWidth(false);
    setDisplayPartTwoFour(false);
  }

  const handleImgClick = () => {
    userRef.current = false;

    setDisplayPartTwoFour(true);
    setStyleWidth(false);
  };

  return (
    <div
      className="HeaderRight"
      onClick={() => {
        slider2 && setSlider2(false);
        sidebar && setSidebar(false);
      }}
    >
      <div className="HeaderLeft">
        <ArrowBackIcon
          style={
            !stylesWidth
              ? { display: "none" }
              : { marginRight: "0px", width: "30px", height: "30px" }
          }
          className="cursor"
          onClick={handleImgClick}
        />
        <div>
          <Avatar alt="Remy Sharp" src={groupLogo} className="header3part" />
        </div>
        <div>
          <h2 className="header3part-h2">{headerName}</h2>
          <p className="header3part-p">{lastSeen}</p>
        </div>
      </div>
      <div className="headerLeft2part">
        {/* <SearchSharpIcon
          className="header2part cursor"
          onClick={(event) => setSearchMessage(event.target.value)}
        />
        <AttachFileTwoToneIcon className="header2part cursor" /> */}

        <MoreVertSharpIcon
          className="header2part cursor"
          onClick={() => setSidebar(!sidebar)}
        />
      </div>
    </div>
  );
};
export default HeaderRight;

import React, { useContext } from "react";
import "../App.css";
import Avatar from "@mui/material/Avatar";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MyContext } from "../App";

const HeaderRight = () => {
  const {
    lastSeen,
    headerName,
    stylesWidth,
    setStyleWidth,
    setDisplayPartTwoFour,
    userRef,
  } = useContext(MyContext);
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
    <div className="HeaderRight">
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
          <Avatar alt="Remy Sharp" src="" className="header3part" />
        </div>
        <div>
          <h2 style={{ margin: 0, marginLeft: "20px" }}>{headerName}</h2>
          <p style={{ margin: 0, marginLeft: "20px", fontSize: "10px" }}>
            {lastSeen}
          </p>
        </div>
      </div>
      <div className="headerLeft2part">
        <SearchSharpIcon className="header2part cursor" />
        <AttachFileTwoToneIcon className="header2part cursor" />
        <MoreVertSharpIcon className="header2part cursor" />
      </div>
    </div>
  );
};
export default HeaderRight;

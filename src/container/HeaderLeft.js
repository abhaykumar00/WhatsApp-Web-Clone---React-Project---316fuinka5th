import React, { useContext, useRef } from "react";
import "../App.css";
import Avatar from "@mui/material/Avatar";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import { MyContext } from "../App";
const HeaderLeft = () => {
  const mynewRef = useRef("H");

  const { userPhotoUrl } = useContext(MyContext);
  if (userPhotoUrl.indexOf("http") !== -1) {
    mynewRef.current = userPhotoUrl;
  }
  return (
    <div className="HeaderLeft">
      <Avatar alt="Remy Sharp" src={mynewRef.current} className="header3part" />
      <div className="HeaderLeft2">
        <Avatar
          sx={{ width: "25px", height: "25px" }}
          className="header2part cursor"
          alt="Remy Sharp"
          src="https://screenshots.imgix.net/mui-org/material-ui-icons/donut-large/~v=3.9.2/c67b6ea5-c542-44f3-b80a-9c522dd5b3f6.png?ixlib=js-1.2.0&s=e936aba1486ed3c329cdd6349caadf1btps://cdn2.iconfinder.com/data/icons/ui-chat-app-1/32/24-status-update-1024.png"
        />
        <CommentSharpIcon className="header2part cursor" />
        <MoreVertSharpIcon className="header2part cursor" />
      </div>
    </div>
  );
};
export default HeaderLeft;

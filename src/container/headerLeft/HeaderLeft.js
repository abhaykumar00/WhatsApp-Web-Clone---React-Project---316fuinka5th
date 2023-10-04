import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./headerLeft.css";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import { MyContext } from "../../App";
import firebaseApiCall from "../../Functions/FirebaseApiCall";
import handleNewGroup from "../../Functions/HandleNewGroup";
import setNewGmailInFirstore from "../../Functions/SetNewGmailInFirstore";
import firestore from "../../firebase";
import { useNavigate } from "react-router-dom";
const HeaderLeft = () => {
  const [allGmail, setAllGmail] = useState([]);
  const mynewRef = useRef("P");

  const {
    globalAllGmail,
    setGlobalAllGmail,
    userPhotoUrl,
    email,
    userName,
    nameChat,
    setNameChat,
    slider2,
    setSlider2,
    setSidebar,
    sidebar,
    setGroupInfo,
    displayForGroup,
    setDisplayForGroup,
    displayMiddleSlider,
    setDisplayMiddleSlider,
  } = useContext(MyContext);
  const navigate = useNavigate();
  const [docs, setDocuments] = useState([]);

  if (userPhotoUrl.indexOf("http") !== -1) {
    mynewRef.current = userPhotoUrl;
  }
  function handleNavigation() {
    navigate("/");
    window.location.reload();
  }

  async function fetchGmail() {
    try {
      const gml = await firebaseApiCall({ setAllGmail, mynewRef });

      const filterdata =
        gml &&
        gml[0] &&
        gml[0].names &&
        gml[0].names.filter((mail) => mail.gmail !== email);
      setGlobalAllGmail(filterdata);
      setAllGmail(gml);

      if (gml[0].names.filter((value) => value.gmail === email).length === 0) {
        const data = [
          ...gml[0].names,
          { gmail: email, name: userName, src: mynewRef.current },
        ];
        console.log("this is data in the headerleft", data);
        setNewGmailInFirstore({ data, mynewRef });
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchGmail();
  }, []);
  useEffect(() => {
    const unsubscribe = firestore.collection("names").onSnapshot((snapshot) => {
      const fetchedDocuments = [];

      snapshot.forEach((doc) => {
        const documentData = doc.data();
        fetchedDocuments.push({
          id: doc.id,
          ...documentData,
        });
      });

      setDocuments(fetchedDocuments);
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // if (docs.length !== 0 && allGmail && allGmail[0] && allGmail[0].names) {
  //   newData = docs.filter(
  //     (doc) =>
  //       doc.type === "personal" &&
  //       allGmail.every((algml) => {
  //         const result = algml.gmail1 === eml || algml.gmail2 === eml;
  //         console.log(
  //           `algml.gmail1: ${algml}, algml.gmail2: ${allGmail}, eml: ${eml}, result: ${result}`
  //         );
  //         return result;
  //       })
  //   );
  // }

  return (
    <div
      className="HeaderLeft"
      onClick={() => {
        if (nameChat) setNameChat(!nameChat);
        setSidebar(false);
        setSlider2(false);
        setGroupInfo(false);
        if (displayMiddleSlider) setDisplayMiddleSlider(false);
      }}
    >
      <Avatar alt="Remy Sharp" src={mynewRef.current} className="header3part" />

      <div className="HeaderLeft2">
        {
          //   <Avatar
          //     className="header2part cursor"
          //     alt="Remy Sharp"
          //     src="https://screenshots.imgix.net/mui-org/material-ui-icons/donut-large/~v=3.9.2/c67b6ea5-c542-44f3-b80a-9c522dd5b3f6.png?ixlib=js-1.2.0&s=e936aba1486ed3c329cdd6349caadf1btps://cdn2.iconfinder.com/data/icons/ui-chat-app-1/32/24-status-update-1024.png"
          //   />
        }
        <div className="headerLeft-childDiv">
          <CommentSharpIcon
            className="header2part cursor commentSharp"
            onClick={() => {
              setNameChat(!nameChat);
            }}
          />
          {nameChat && (
            <div className="headerLeftGmail" onClick={fetchGmail}>
              {allGmail &&
                allGmail[0] &&
                allGmail[0].names &&
                allGmail[0].names
                  .filter((mail) => mail.gmail !== email)
                  .map((mail, index) => (
                    <div
                      className="headerLeftGmailDiv"
                      key={index}
                      onClick={() => {
                        // Assuming mail, email, userName are defined elsewhere

                        const filteredDocs = docs.filter((doc) => {
                          const condition =
                            (doc.type === "personal" &&
                              doc.gmail1 === mail.gmail &&
                              doc.gmail2 === email) ||
                            (doc.gmail2 === mail.gmail && doc.gmail1 === email);

                          // console.log(`Condition met for doc:`, doc, condition);

                          return condition;
                        });

                        if (filteredDocs.length === 0) {
                          handleNewGroup({ mail, email, userName, mynewRef });
                        } else
                          toast.error(
                            mail.name + "  is already availble in chatSection"
                          );

                        setNameChat(false);
                      }}
                    >
                      <h6 className="headerLeftGmailDiv-h6">{mail.name}</h6>
                      <p className="headerLeftGmailDiv-p">{mail.gmail}</p>
                    </div>
                  ))}
            </div>
          )}
        </div>
        <div
          className="headerLeft-childDiv"
          onClick={() => setDisplayMiddleSlider(!displayMiddleSlider)}
        >
          <MoreVertSharpIcon className="header2part cursor" />
          {displayMiddleSlider && (
            <div className="displayMiddleSlider">
              <p
                className="displayMiddleSlider-p"
                onClick={() => {
                  setDisplayMiddleSlider(false);
                  setDisplayForGroup(true);
                }}
              >
                Create Group
              </p>

              <h6 onClick={handleNavigation} className="sidebar1">
                Signout
              </h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HeaderLeft;

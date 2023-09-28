import React, { useContext, useRef } from "react";

import "./chatNames.css";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import firestore from "../../firebase";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { MyContext } from "../../App";
import setVisibilityForGroup from "../../Functions/Visibility";

const ChatNames = () => {
  const {
    lastMessage,
    setId,
    setHeaderName,
    setStyleWidth,
    setDisplayPartTwoFour,
    setNameChat,
    setPart2Active,
    userRef,
    setGroupLogo,
    email,
    userName,
  } = useContext(MyContext);

  const userPhotoUrl = localStorage.getItem("userPhotoUrl");
  console.log("thi is email in the chatNames", email);
  const links = [
    "https://tse2.mm.bing.net/th?id=OIP.Or-LePbc4e9rx9DmntAqQAHaFj&pid=Api&P=0&h=180",
    "https://pm1.narvii.com/6526/95bc1261f2630386a6ec17460f3725c6022b28ba_hq.jpg",
    "https://i.pinimg.com/originals/d9/7f/1b/d97f1bb8ae812d9319da887bd0eb2196.jpg",
  ];
  const [documents, setDocuments] = useState([{ name: "" }]);
  const { nameId, setNameId, nameUpdate } = useContext(MyContext);
  const [changeName, setChangeName] = useState(false);
  const [searching, setSearching] = useState("");
  const [newSearching, setNewSeraching] = useState([]);

  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 500) {
      setStyleWidth(false);
      setDisplayPartTwoFour(false);
      setPart2Active(false);
    }
    if (windowWidth <= 600) {
      if (userRef.current) {
        setDisplayPartTwoFour(false);
        setStyleWidth(true);
      } else {
        setDisplayPartTwoFour(true);
      }
    }
  };
  useEffect(async () => {
    const collectionRef = await firestore.collection("names");
    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const namesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewSeraching(namesArray);
      setDocuments(namesArray);
      setNameId(namesArray);
      console.log(namesArray, "this is names Array");
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  // only use when we add new person
  function handleNewName() {
    const a = window.prompt("Please enter Group Name", "");
    if (a != null) {
      const createNewDocument = async () => {
        try {
          const collectionRef = await firestore.collection("names");
          const newDocRef = await collectionRef.add({
            message: [],
            name: a,
            src: links[nameId.length % 3],
            type: "all",
            adminName: email,
            visibility: [{ email }],
          });
          setChangeName(!changeName);

          setDocuments([...documents, { id: newDocRef.id }]);

          console.log(
            "New document created in Firestore with ID:",
            newDocRef.id
          );
        } catch (error) {
          console.error("Error creating new document in Firestore:", error);
        }
      };
      createNewDocument();
    }
  }

  //when page is loading then get the new values of all listed person
  useEffect(() => {
    const fetchFirestoreDocuments = async () => {
      try {
        const collectionRef = await firestore.collection("names");
        const snapshot = await collectionRef.get();
        const fetchedDocuments = [];

        snapshot.forEach((doc) => {
          const documentData = doc.data();
          fetchedDocuments.push({
            id: doc.id,
            ...documentData,
          });
        });
        setDocuments(fetchedDocuments);
        setNameId([...fetchedDocuments]);
        setNewSeraching([...fetchedDocuments]);
      } catch (error) {
        console.error("Error fetching documents from Firestore: ", error);
      }
    };

    fetchFirestoreDocuments();
  }, [changeName, lastMessage, nameUpdate]);
  console.log("this is name id line 137 vhatnames", nameId);
  function handleSearching(event) {
    if (event.target.value) {
      const valuee = nameId.filter((name) => {
        if (name.type === "all")
          return name.name.indexOf(event.target.value.toLowerCase()) !== -1;
        else if (name.type === "personal") {
          if (name.gmail1 === email) {
            return (
              name.name1
                .toLowerCase()
                .indexOf(event.target.value.toLowerCase()) !== -1
            );
          } else if (name.gmail1 === email) {
            return (
              name.name2
                .toLowerCase()
                .indexOf(event.target.value.toLowerCase()) !== -1
            );
          }
        }
      });
      setNewSeraching(valuee);
    } else {
      const valuee = nameId;
      setNewSeraching(valuee);
    }
  }

  console.log(newSearching, "this is new Searching");
  return (
    <>
      <div
        className="chatNames"
        onClick={() => {
          setNameChat(false);
          console.log("hello");
        }}
      >
        <SearchIcon className="chatNames-searchIcon" />

        <input className="chatNamesInput" onChange={handleSearching} />
        <h1 className="chatNamesH1" onClick={handleNewName}>
          Add New Group +
        </h1>
      </div>
      <div className="chatNames2">
        <div className="chatNames4">
          {newSearching.map((name) => (
            <Link className="chatNames4-Link" to={"/" + name.id} key={name.id}>
              {name.type === "all" &&
                name.visibility &&
                name.visibility.length > 0 &&
                name.visibility.filter((value) => {
                  console.log(
                    value.email,
                    "this is email184 chatNames",
                    email,
                    email && value.email === email
                  );
                  return email && value.email === email;
                }).length > 0 && (
                  <div
                    className="chatNamesDiv"
                    onClick={() => {
                      if (window.innerWidth < 620) {
                        setStyleWidth(true);

                        userRef.current = true;

                        setDisplayPartTwoFour(false);
                      }
                      setId(name.id);
                      setHeaderName(name.name);
                      setGroupLogo(name.src);
                      localStorage.setItem("type", "all");
                    }}
                    key={name.id}
                  >
                    <img
                      className="chatNamesDiv-img"
                      src={name.src}
                      alt="image"
                    ></img>
                    <div className="chatNamesDiv-div">
                      <div className="chatNamesDiv-childDiv">
                        <h6 className="chatNamesDivH6">{name.name}</h6>
                        <h5 className="chatNamesDivH5">
                          {name &&
                            name.message &&
                            name.message[name.message.length - 1] &&
                            name.message[name.message.length - 1].day && (
                              <p>{name.message[name.message.length - 1].day}</p>
                            )}
                        </h5>
                      </div>

                      {name &&
                        name.message &&
                        name.message[name.message.length - 1] &&
                        name.message[name.message.length - 1].message && (
                          <p className="chatNamesDivH5P">
                            {name.message[name.message.length - 1].message}
                          </p>
                        )}
                    </div>
                  </div>
                )}
              {name.type === "personal" &&
                (name.gmail1 === email || name.gmail2 === email) && (
                  <div
                    className="chatNamesDiv"
                    onClick={() => {
                      if (window.innerWidth < 620) {
                        setStyleWidth(true);

                        userRef.current = true;

                        setDisplayPartTwoFour(false);
                      }
                      const objectAsString = JSON.stringify(name);
                      localStorage.setItem("gmailNameObj", objectAsString);

                      localStorage.setItem("type", "personal");
                      setId(name.id);
                      if (name.gmail1 === email) {
                        setHeaderName(name.name1);
                        setGroupLogo(name.src1);
                      } else {
                        setHeaderName(name.name2);
                        setGroupLogo(name.src2);
                      }
                      // setGroupLogo(name.src);
                    }}
                    key={name.id}
                  >
                    <img
                      className="chatNamesDiv-img"
                      src={name.gmail1 === email ? name.src1 : name.src2}
                      alt="image"
                    ></img>
                    <div className="chatNamesDiv-div">
                      <div className="chatNamesDiv-childDiv">
                        <h6 className="chatNamesDivH6">
                          {name.gmail1 === email ? name.name1 : name.name2}
                        </h6>
                        <h5 className="chatNamesDivH5">
                          {name &&
                            name.message &&
                            name.message[name.message.length - 1] &&
                            name.message[name.message.length - 1].day && (
                              <p>{name.message[name.message.length - 1].day}</p>
                            )}
                        </h5>
                      </div>

                      {name &&
                        name.message &&
                        name.message[name.message.length - 1] &&
                        name.message[name.message.length - 1].message && (
                          <p className="chatNamesDivH5P">
                            {name.message[name.message.length - 1].message}
                          </p>
                        )}
                    </div>
                  </div>
                )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default ChatNames;

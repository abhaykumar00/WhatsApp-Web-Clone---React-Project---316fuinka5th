import React, { useContext, useRef } from "react";
import "../App.css";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import firestore from "../firebase";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { MyContext } from "../App";

let style = { display: "none" };
const ChatNames = () => {
  const {
    lastMessage,
    setId,
    setHeaderName,
    setStyleWidth,
    setDisplayPartTwoFour,
    part2Active,
    setPart2Active,
    userRef,
  } = useContext(MyContext);

  const links = [
    "https://tse2.mm.bing.net/th?id=OIP.Or-LePbc4e9rx9DmntAqQAHaFj&pid=Api&P=0&h=180",
    "https://pm1.narvii.com/6526/95bc1261f2630386a6ec17460f3725c6022b28ba_hq.jpg",
    "https://i.pinimg.com/originals/d9/7f/1b/d97f1bb8ae812d9319da887bd0eb2196.jpg",
  ];
  const [documents, setDocuments] = useState([{ name: "" }]);
  const { nameId, setNameId } = useContext(MyContext);
  const [changeName, setChangeName] = useState(false);

  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 606) {
      setStyleWidth(false);
      setDisplayPartTwoFour(false);
      setPart2Active(false);
    }
    if (windowWidth <= 606) {
      if (userRef.current) {
        setDisplayPartTwoFour(false);
        setStyleWidth(true);
      } else {
        setDisplayPartTwoFour(true);
      }
    }
  };

  // Add the event listener using useEffect
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    // Clean up the event listener when the component is unmounted
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
        //const fetchedDocuments = snapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));

        snapshot.forEach((doc) => {
          const documentData = doc.data();
          fetchedDocuments.push({
            id: doc.id,
            ...documentData,
          });
        });
        setDocuments(fetchedDocuments);
        setNameId([...fetchedDocuments]);
      } catch (error) {
        console.error("Error fetching documents from Firestore: ", error);
      }
    };

    fetchFirestoreDocuments();
  }, [changeName, lastMessage]);

  return (
    <>
      <div className="chatNames">
        <SearchIcon sx={{ position: "absolute", left: "19px", top: "12px" }} />

        <input />
      </div>
      <div className="chatNames2">
        <h1 onClick={handleNewName}>Add New Group Name</h1>
        <div className="chatNames4">
          {nameId.map((name) => (
            <Link
              to={"/" + name.id}
              key={name.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="chatNamesDiv"
                onClick={() => {
                  if (window.innerWidth < 606) {
                    setStyleWidth(true);

                    userRef.current = true;

                    setDisplayPartTwoFour(false);
                  }
                  setId(name.id);
                  setHeaderName(name.name);
                }}
                key={name.id}
              >
                <img
                  style={{ marginLeft: "30px" }}
                  src={name.src}
                  alt="image"
                ></img>
                <div>
                  <h6>{name.name}</h6>

                  <p>
                    {name &&
                      name.message &&
                      name.message[name.message.length - 1] &&
                      name.message[name.message.length - 1].message && (
                        <p>{name.message[name.message.length - 1].message}</p>
                      )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default ChatNames;

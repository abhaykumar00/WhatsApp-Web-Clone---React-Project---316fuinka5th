import { Button, Container, Grid, TextField } from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "@firebase/auth";
import { auth, provider } from "./container/firebase";
import { useNavigate } from "react-router";
import { useState } from "react";

const Google = () => {
  const navigate = useNavigate();
  const onLoginClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("RESULT", result.user.displayName);
        const userName = result.user.displayName;
        const userPhotoUrl = result.user.photoURL;
        navigate("/home", {
          state: {
            userName,
            userPhotoUrl,
          },
        });
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };

  return (
    <>
      <Grid
        alignItems="center"
        justifyContent="center"
        display={"flex"}
        flexDirection={"column"}
        container
        sx={{ height: "90vh" }}
      >
        <img
          src="https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png"
          alt="Image"
          style={{ width: "100px", height: "100px", marginBottom: "40px" }}
        />
        <h1 style={{ marginBottom: "70px" }}>Sign in to Whatsapp</h1>
        <Grid item>
          <button
            onClick={onLoginClick}
            style={{
              height: "40px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "20px",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoogleIcon sx={{ mr: 5 }} />
            <span>Signin with Google</span>
          </button>
        </Grid>
      </Grid>
    </>
  );
};

export default Google;

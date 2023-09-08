import React, { useState, useEffect } from "react";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
function AudioRecorder() {
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
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  return (
    <div>
      <MicTwoToneIcon
        sx={{
          margin: "10px",
          flexShrink: 2,
        }}
        onClick={isRecording ? stopRecording : startRecording}
      />

      {audioChunks.length > 0 && (
        <audio controls>
          <source
            src={URL.createObjectURL(
              new Blob(audioChunks, { type: "audio/wav" })
            )}
          />
        </audio>
      )}
    </div>
  );
}

export default AudioRecorder;

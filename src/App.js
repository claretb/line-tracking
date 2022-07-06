import React from "react";
import './App.css'
import Webcam from "react-webcam";
import { Button } from "@mui/material"

function App() {

  const webcamRef = React.useRef(null);
  const videoConstraints = {
    height: 720,
    width: 1200,
    facingMode: "environment",
  };

  const ghostCanvas = document.createElement("canvas");

  function getAverage(pixels) {

    const pixelArr = [];
    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    for (let i = 0; i < pixels.data.length; i = i + 4) {
      pixelArr.push(pixels.data[i])
    }

    // returns average integer to 2 decimal places
    return average(pixelArr).toFixed(2);

  }

  async function startProcess() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ghostCtx = ghostCanvas.getContext("2d");
    var videoWidth = webcamRef.current.video.videoWidth;
    var videoHeight = webcamRef.current.video.videoHeight;

    if (canvas.width != videoWidth || canvas.height != videoHeight) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      ghostCanvas.width = videoWidth;
      ghostCanvas.height = videoHeight;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    var image = new Image;

    image.onload = function () {
      ghostCtx.clearRect(
        0,
        0,
        videoWidth,
        videoHeight
      );

      ghostCtx.filter = 'grayscale(1)';
      ghostCtx.drawImage(image, 0, 0);

      var left = getAverage(ghostCtx.getImageData(0, videoHeight - 150, (videoWidth / 3), 150));
      var centre = getAverage(ghostCtx.getImageData((videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150));
      var right = getAverage(ghostCtx.getImageData(2 * (videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150));
      var decision = "NO WAY!";

      if (centre < 90) {
        decision = "FORWARD";
      }
      else if (left < 90) {
        decision = "LEFT";
      }
      else if (right < 90) {
        decision = "RIGHT";
      }

      ctx.clearRect(
        0,
        0,
        videoWidth,
        videoHeight
      );

      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";

      ctx.strokeRect(0, videoHeight - 150, (videoWidth / 3), 150);
      ctx.strokeRect((videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150);
      ctx.strokeRect(2 * (videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150);

      ctx.font = "50px Arial";
      ctx.fillStyle = "red";

      ctx.fillText(left, (videoWidth * 3 / 30), videoHeight - 55);
      ctx.fillText(centre, (videoWidth * 13 / 30), videoHeight - 55);
      ctx.fillText(right, (videoWidth * 23 / 30), videoHeight - 55);

      if (decision != null) {

        ctx.font = "70px Arial";
        ctx.fillStyle = "green";

        ctx.fillText(decision, (videoWidth / 3), videoHeight - 200);
      }

      setTimeout(() => startProcess(), 10);
    }

    image.src = imageSrc;

  };

  return (

    <div>
      <div style={{ position: "absolute" }}>
        <Webcam
          audio={false}
          id="img"
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored={false}
        />
      </div>
      <div style={{ position: "absolute" }}>
        <canvas
          id="myCanvas"
          width={720}
          height={1200}
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      <div>
        <Button
          variant={"contained"}
          style={{
            color: "white",
            backgroundColor: "blueviolet",
            width: "50%",
            maxWidth: "250px",
          }}
          onClick={() => {
            startProcess();
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default App;
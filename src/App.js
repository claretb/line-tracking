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

  var firstImage = null;
  var left = 0;
  var centre = 0;
  var right = 0;
  var decision = null;

  function startProcess() {
    var canvas = document.getElementById("myCanvas");
    // var ghostCanvas = document.getElementById("ghostCanvas");

    var videoWidth = webcamRef.current.video.videoWidth;
    var videoHeight = webcamRef.current.video.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    ghostCanvas.width = videoWidth;
    ghostCanvas.height = videoHeight;

    var ctx = canvas.getContext("2d");
    var ghostCtx = ghostCanvas.getContext("2d");
    ctx.clearRect(
      0,
      0,
      videoWidth,
      videoHeight
    );
    ghostCtx.clearRect(
      0,
      0,
      videoWidth,
      videoHeight
    );

    const imageSrc = webcamRef.current.getScreenshot();
    var image = new Image;
    image.src = imageSrc;
    if (firstImage == null) {
      firstImage = image;
    }

    ghostCtx.filter = 'grayscale(1)';
    ghostCtx.drawImage(image, 0, 0);

    // var grayscaleImageData = ghostCtx.getImageData(0, 0, videoWidth, videoHeight);

    var newLeft = getAverage(ghostCtx.getImageData(0, videoHeight - 150, (videoWidth / 3), 150));
    var newCentre = getAverage(ghostCtx.getImageData((videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150));
    var newRight = getAverage(ghostCtx.getImageData(2 * (videoWidth / 3), videoHeight - 150, (videoWidth / 3), 150));

    if (newLeft != 0 || newRight != 0 || newCentre != 0) {
      left = newLeft;
      right = newRight;
      centre = newCentre;

      if (centre < 90) {
        decision = "FORWARD";
      }
      else if (left < 90) {
        decision = "LEFT";
      }
      else if (right < 90) {
        decision = "RIGHT";
      }
      else {
        decision = "NO WAY!";
      }
    }

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

    setTimeout(() => startProcess(), 1);
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
      {/* <div style={{ marginTop: "1200px"  }}>
        <canvas
          id="ghostCanvas"
          width={720}
          height={1200}
          style={{ backgroundColor: "blue" }}
        />
      </div> */}
    </div>
  );
}

export default App;
const camera = document.getElementById("videoInput");
let isStreamConnected = false;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    facingMode: { exact: "encironment" },
  })
  .then((stream) => {
    camera.srcObject = stream;
    camera.addEventListener(
      "canplay",
      () => {
        isStreamConnected = true;
        camera.width = camera.videoWidth;
        camera.height = camera.videoHeight;
      },
      false
    );
  })
  .catch(function (err) {
    console.error("getUserMedia Err:", err);
  });

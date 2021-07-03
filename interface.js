const player = document.getElementById("videoInput");
let isCvLoaded = false;

function onOpenCvReady() {
  if (cv.getBuildInformation) {
    console.log(cv.getBuildInformation());
    onloadCallback();
  } else {
    cv["onRuntimeInitialized"] = () => {
      console.log(cv.getBuildInformation());
      onloadCallback();
    };
  }
}

function onloadCallback() {
  isCvLoaded = true;
}

navigator.mediaDevices
  .getUserMedia({
    video: true,
  })
  .then((stream) => {
    player.srcObject = stream;
    player.addEventListener(
      "canplay",
      () => {
        player.width = player.videoWidth;
        player.height = player.videoHeight;
        setTimeout(entry, 100);
      },
      false
    );
  });

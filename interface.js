const camera = document.getElementById("videoInput");
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
    camera.srcObject = stream;
    camera.addEventListener(
      "canplay",
      () => {
        camera.width = camera.videoWidth;
        camera.height = camera.videoHeight;
        setTimeout(entry, 100);
      },
      false
    );
  });

function entry() {
  if (!isCvLoaded) {
    setTimeout(entry, 100);
    return;
  }
  init();
  first();
  loopWrap(30);
  return;
}

function loopWrap(fps) {
  let startTime = Date.now();
  loop();
  setTimeout(loopWrap, 1000 / fps - (Date.now() - startTime));
}

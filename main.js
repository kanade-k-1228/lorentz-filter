const player = document.getElementById("videoInput");
let src = null;
let dst = null;
let cap = null;
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

const constraints = {
  video: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  player.srcObject = stream;
  player.addEventListener("canplay", onVideoCanPlay, false);
});

function onVideoCanPlay() {
  player.width = player.videoWidth;
  player.height = player.videoHeight;
  setTimeout(processVideo, 100);
}

const FPS = 10;
function processVideo() {
  try {
    if (!isCvLoaded) {
      setTimeout(processVideo, 100);
      return;
    } else if (cap == null) {
      cap = new cv.VideoCapture(player);
    }
    let begin = Date.now();

    src = new cv.Mat(player.height, player.width, cv.CV_8UC4);
    dst = new cv.Mat();
    cap.read(src);

    // Main

    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

    //

    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();

    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  } catch (err) {
    console.error(err.message);
  }
  return;
}

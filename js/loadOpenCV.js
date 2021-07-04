let isOpenCVLoaded = false;

function onOpenCvReady() {
  if (cv.getBuildInformation) {
    onloadCallback();
  } else {
    cv["onRuntimeInitialized"] = () => {
      onloadCallback();
    };
  }
}
function onloadCallback() {
  // console.log(cv.getBuildInformation());
  isOpenCVLoaded = true;
}

let isOpenCVLoaded = false;

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
  isOpenCVLoaded = true;
}

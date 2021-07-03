const fps = 30;

function entry() {
  console.log("entry");
  if (!isOpenCVLoaded) return;
  init();
  loopWrap();
  return;
}

function loopWrap() {
  let startTime = Date.now();
  loop();
  setTimeout(loopWrap, 1000 / fps - (Date.now() - startTime));
}

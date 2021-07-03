const fps = 60;

function entry() {
  console.log("entry");
  if (!isOpenCVLoaded) {
    setTimeout(entry, 100);
    return;
  }
  init();
  loopWrap();
  return;
}

function loopWrap() {
  let startTime = Date.now();
  loop();
  setTimeout(loopWrap, 1000 / fps - (Date.now() - startTime));
}

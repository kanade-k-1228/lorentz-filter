const fps = 30;

function entry() {
  if (!isOpenCVLoaded) {
    setTimeout(entry, 100);
    return;
  }
  init();
  first();
  loopWrap();
  return;
}

function loopWrap() {
  let startTime = Date.now();
  loop();
  setTimeout(loopWrap, 1000 / fps - (Date.now() - startTime));
}

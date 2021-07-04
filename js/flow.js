let fps, slitWidth, slitCount, ratio;
let running = false;

function entry() {
  fps = parseInt(document.getElementById("fps").value);
  slitCount = parseInt(document.getElementById("slitCount").value);
  slitWidth = parseInt(document.getElementById("slitWidth").value);
  ratio = parseInt(document.getElementById("ratio").value);
  console.log(`Start fps:${fps}, slitCount:${slitCount}, slitWidth:${slitWidth}, ratio:${ratio}`);
  if (!isOpenCVLoaded) return;
  running = true;
  init();
  loopWrap();
  return;
}

function loopWrap() {
  let startTime = Date.now();
  if (!running) return;
  loop();
  // console.log(Math.round(1000 / fps - (Date.now() - startTime)));
  setTimeout(loopWrap, 1000 / fps - (Date.now() - startTime));
}

function start() {
  entry();
}

function stop() {
  running = false;
}

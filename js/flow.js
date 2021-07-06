let filter, fps, slitWidth, slitCount, ratio;
let running = false;
let init, loop;

function entry() {
  filter = document.getElementById("filter").value;
  if (filter === "t2x") {
    init = t2x_init;
    loop = t2x;
  } else if (filter === "lorentz") {
    init = lorentz_init;
    loop = lorentz;
  } else {
    return;
  }
  fps = parseInt(document.getElementById("fps").value);
  slitCount = parseInt(document.getElementById("slitCount").value);
  slitWidth = parseInt(document.getElementById("slitWidth").value);
  ratio = parseInt(document.getElementById("ratio").value);
  console.log(`Start filter:${filter}, fps:${fps}, slitCount:${slitCount}, slitWidth:${slitWidth}, ratio:${ratio}`);
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

function save() {
  let link = document.createElement("a");
  link.href = document.getElementById("canvasOutput").toDataURL("image/jpeg");
  link.download = "canvas.png";
  link.click();
}

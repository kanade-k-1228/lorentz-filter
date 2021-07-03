const FPS = 30;
let cap, src, dst, vslit, hslit;
let startTime;

function entry() {
  if (!isCvLoaded) {
    setTimeout(entry, 100);
    return;
  }
  cap = new cv.VideoCapture(player);
  init();
  first();
  loop();
  return;
}

function init() {
  src = new cv.Mat(player.height, player.width, cv.CV_8UC4);
  dst = new cv.Mat();
  vslit = new cv.Rect(0, 0, 10, player.height);
  hslit = new cv.Rect(0, 0, player.width, 10);
}

function first() {
  cap.read(src);
  dst = src.roi(vslit);
}

function loop() {
  startTime = Date.now();
  cap.read(src);

  // Main
  // cv.vconcat((dst, src.roi(rect)), dst);
  // 画像をマスクしてアルファブレンド
  // masks.forEach((mask, i) => {
  //   cv.addWeighted(dst, 1, cv.bitwise_and(past[past.length - 1 - i], mask), 1, 0, dst);
  // });
  let imgs = new cv.MatVector();
  imgs.push_back(dst);
  imgs.push_back(src.roi(vslit));
  cv.hconcat(imgs, dst);
  // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  // cv.vconcat((dst, src), dst);
  //

  cv.imshow("canvasOutput", dst);
  setTimeout(loop, 1000 / FPS - (Date.now() - startTime));
  return;
}

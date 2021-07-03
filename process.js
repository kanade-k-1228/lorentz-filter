let cap, src, dst, vslit, hslit;
let imgs;

function init() {
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4);
  dst = new cv.Mat();
  vslit = new cv.Rect(0, 0, 1, camera.height);
  hslit = new cv.Rect(0, 0, camera.width, 1);
  imgs = new cv.MatVector();
}

function first() {
  cap.read(src);
  dst = src.roi(vslit);
}

function loop() {
  startTime = Date.now();
  cap.read(src);

  imgs.push_back(src.roi(vslit).clone());
  cv.hconcat(imgs, dst);

  cv.imshow("canvasOutput", dst);
  return;
}

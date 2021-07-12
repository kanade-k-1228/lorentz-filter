let fps, slitWidth, slitCount, ratio;
let running = false;

// エントリポイント
function start() {
  fps = parseInt(document.getElementById("fps").value);
  slitCount = parseInt(document.getElementById("slitCount").value);
  slitWidth = parseInt(document.getElementById("slitWidth").value);
  ratio = parseInt(document.getElementById("ratio").value);
  console.log(`Start: T2X, fps:${fps}, slitCount:${slitCount}, slitWidth:${slitWidth}, ratio:${ratio}`);
  if (!isOpenCVLoaded) return;
  running = true;
  init();
  mainLoop();
  return;
}

// メインループ
function mainLoop() {
  let startTime = Date.now();
  if (!running) return;
  loop();
  setTimeout(mainLoop, 1000 / fps - (Date.now() - startTime));
}

// スキャン開始
function onStart() {
  running = true;
  start();
}

// スキャン停止
function onStop() {
  running = false;
}

// 画像保存
function onSave() {
  let link = document.createElement("a");
  link.href = document.getElementById("canvasOutput").toDataURL("image/jpeg");
  link.download = Date.now();
  link.click();
}

let cap, src, acc, out, slit;

// 初期化
function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  acc = new cv.Mat(); // アキュムレータ
  out = new cv.Mat(); // 出力画像
  slit = new cv.Rect(Math.floor(camera.width / 2), 0, slitWidth, camera.height); // スリット
  // 初期値を代入
  cap.read(src);
  const tmp = new cv.MatVector();
  for (let i = 0; i < slitCount; i++) {
    tmp.push_back(src.roi(slit));
  }
  cv.hconcat(tmp, acc);
}

// -----------------
// 時間軸をx軸に変換
// -----------------
function loop() {
  cap.read(src); // カメラ画像をキャプチャ

  const add = src.roi(slit).clone();
  pushRightKeepWidth(acc, add);
  add.delete();

  const size = new cv.Size(Math.round(acc.size().width * ratio), acc.size().height);
  cv.resize(acc, out, size, 0, 0, cv.INTER_AREA);

  cv.imshow("canvasOutput", out); // 画像出力
}

// 幅を保って右側に追加
function pushRightKeepWidth(target, add) {
  const targetRoi = new cv.Rect(add.size().width, 0, target.size().width - add.size().width, target.size().height);
  const vec = new cv.MatVector();
  vec.push_back(target.roi(targetRoi));
  vec.push_back(add);
  cv.hconcat(vec, target);
  return;
}

// 幅を伸縮
function resizeWidth(target, ratio) {
  const size = new cv.Size(Math.round(target.size().width * ratio), target.size().height);
  cv.resize(target, target, size, 0, 0, cv.INTER_AREA);
  return;
}

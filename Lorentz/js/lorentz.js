let filter, fps, scanSpeed, slitCount;
let running = false;

// エントリポイント
function entry() {
  fps = parseInt(document.getElementById("fps").value);
  scanSpeed = parseInt(document.getElementById("scanSpeed").value);
  slitCount = Math.floor(camera.width / scanSpeed);
  console.log(`Start: Lorentz, fps:${fps}, slitCount:${slitCount}, scanSpeed:${scanSpeed}, ${scanSpeed * slitCount}`);
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
  entry();
}

// スキャン停止
function onStop() {
  running = false;
}

// 画像保存
function onSsave() {
  let link = document.createElement("a");
  link.href = document.getElementById("canvasOutput").toDataURL("image/jpeg");
  link.download = Date.now();
  link.click();
}

// Cyclic にメモリを使う
let imgs = [];
let pointer = 0;

let cap, src, dst, size;
let masks = [];
let matvec;

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像
  size = new cv.Size(camera.width, camera.height); // 出力画像のサイズ
  // マスク
  masks = [];
  for (let i = 0; i < slitCount; i++) {
    const rect = new cv.Rect(scanSpeed * i, 0, scanSpeed, camera.height);
    masks.push(rect);
  }
  // 初期値を代入
  cap.read(src);
  dst = src.clone();
  for (let i = 0; i < slitCount; i++) {
    imgs.push(src.clone());
  }
}

// -----------------
// 時空間をミックス
// -----------------
function loop() {
  cap.read(imgs[pointer]); // カメラ画像をキャプチャ

  matvec = new cv.MatVector();
  for (let i = 0; i < slitCount; i++) {
    matvec.push_back(imgs[(pointer - i + slitCount) % slitCount].roi(masks[i]));
  }
  cv.hconcat(matvec, dst);
  matvec.delete();

  // cv.resize(dst, dst, size, 0, 0, cv.INTER_AREA);

  cv.imshow("canvasOutput", dst); // 画像出力
  pointer = (pointer + 1) % slitCount;
}

const loop = t2x;

let cap, src, dst, vslit, hslit;
let imgs;

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像
  vslit = new cv.Rect(Math.floor(camera.width / 2), 0, 1, camera.height); // 縦長のスリット
  hslit = new cv.Rect(0, Math.floor(camera.height / 2), camera.width, 1); // 横長のスリット
  vmask = new cv.Rect(0, 0, 20, camera.height); // 縦長の短冊
  hmask = new cv.Rect(0, 0, camera.width, 20); // 横長の短冊
  imgs = new cv.MatVector();
  // 初期値を代入
  cap.read(src);
  dst = src.clone();
}

// 時空間をミックス
function lorentz() {
  cap.read(src); // カメラ画像をキャプチャ
  dst = src;
  cv.imshow("canvasOutput", dst); // 画像出力
}

// 時間軸をx軸に変換
function t2x() {
  cap.read(src); // カメラ画像をキャプチャ

  const add = src.roi(vslit).clone();
  resizeWidth(add, 3);
  pushRightKeepWidth(dst, add);
  add.delete();

  cv.imshow("canvasOutput", dst); // 画像出力
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

let t2x_cap, t2x_src, t2x_acc, t2x_out, t2x_slit;

function t2x_init() {
  // メモリ確保
  t2x_cap = new cv.VideoCapture(camera);
  t2x_src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  t2x_acc = new cv.Mat(); // アキュムレータ
  t2x_out = new cv.Mat(); // 出力画像
  t2x_slit = new cv.Rect(Math.floor(camera.width / 2), 0, slitWidth, camera.height); // スリット
  // 初期値を代入
  t2x_cap.read(t2x_src);
  const tmp = new cv.MatVector();
  for (let i = 0; i < slitCount; i++) {
    tmp.push_back(t2x_src.roi(t2x_slit));
  }
  cv.hconcat(tmp, t2x_acc);
}

// -----------------
// 時間軸をx軸に変換
// -----------------
function t2x() {
  t2x_cap.read(t2x_src); // カメラ画像をキャプチャ

  const add = t2x_src.roi(t2x_slit).clone();
  pushRightKeepWidth(t2x_acc, add);
  add.delete();

  const size = new cv.Size(Math.round(t2x_acc.size().width * ratio), t2x_acc.size().height);
  cv.resize(t2x_acc, t2x_out, size, 0, 0, cv.INTER_AREA);

  cv.imshow("canvasOutput", t2x_out); // 画像出力
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

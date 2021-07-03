const loop = t2x;

let cap, src, dst, vslit, hslit;
let imgs;

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera); // ストリーム
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像
  vslit = new cv.Rect(0, 0, 1, camera.height); // 縦長のスリット
  hslit = new cv.Rect(0, 0, camera.width, 1); // 横長のスリット
  vmask = new cv.Rect(0, 0, 1, camera.height); // 縦長の短冊
  hmask = new cv.Rect(0, 0, camera.width, 1); // 横長の短冊
  imgs = new cv.MatVector();
  // 初期値を代入
  cap.read(src);
  dst = resizeKeepHeight(src, 0.2);
}

// 時間軸をx軸に変換
function t2x() {
  cap.read(src); // カメラ画像をキャプチャ

  const tmp = new cv.MatVector();
  const dstroi = new cv.Rect(1, 0, dst.size().width - 1, camera.height);
  tmp.push_back(dst.roi(dstroi));
  tmp.push_back(src.roi(vslit)); // 短冊状に切り取り，
  cv.hconcat(tmp, dst); // 合成
  tmp.delete();

  cv.imshow("canvasOutput", resizeKeepHeight(dst, 5)); // 画像出力
}

// 時空間をミックス
function lorentz() {}

function resizeKeepHeight(mat, ratio) {
  const { width, height } = mat.size();
  const ret = new cv.Mat();
  const size = new cv.Size(Math.round(width * ratio), height);
  cv.resize(mat, ret, size, 0, 0, cv.INTER_AREA);
  return ret;
}

const loop = lorentz;

// Cyclic
let imgs = [];
let pointer = 0;

let cap, src, dst, size;
let vmask = [];
let hmask = [];
let matvec;

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像
  size = new cv.Size(Math.round(camera.width * ratio), camera.height); // 出力画像のサイズ

  // マスク
  for (let i = 0; i < slitCount; i++) {
    const rect = new cv.Rect(slitWidth * i, 0, slitWidth, camera.height);
    vmask.push(rect);
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
function lorentz() {
  cap.read(imgs[pointer]); // カメラ画像をキャプチャ

  matvec = new cv.MatVector();
  for (let i = 0; i < slitCount; i++) {
    matvec.push_back(imgs[(pointer - i + slitCount) % slitCount].roi(vmask[i]));
  }
  cv.hconcat(matvec, dst);
  matvec.delete();

  cv.resize(dst, dst, size, 0, 0, cv.INTER_AREA);

  cv.imshow("canvasOutput", dst); // 画像出力
  pointer = (pointer + 1) % slitCount;
}

const loop = lorentz;

// Cyclic
const division_count = 40;
let imgs = [];
let pointer = 0;

let cap, src, dst;
let vmask = [];
let hmask = [];
let matvec;

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像

  // マスク
  const mask_width = Math.round(camera.width / division_count);
  for (let i = 0; i < division_count; i++) {
    const rect = new cv.Rect(mask_width * i, 0, mask_width, camera.height);
    vmask.push(rect);
  }

  // 初期値を代入
  cap.read(src);
  dst = src.clone();
  for (let i = 0; i < division_count; i++) {
    imgs.push(src.clone());
  }
}

// -----------------
// 時空間をミックス
// -----------------
function lorentz() {
  cap.read(imgs[pointer]); // カメラ画像をキャプチャ

  matvec = new cv.MatVector();
  for (let i = 0; i < division_count; i++) {
    matvec.push_back(imgs[(pointer - i + division_count) % division_count].roi(vmask[i]));
  }
  cv.hconcat(matvec, dst);
  matvec.delete();

  cv.imshow("canvasOutput", dst); // 画像出力
  pointer = (pointer + 1) % division_count;
}

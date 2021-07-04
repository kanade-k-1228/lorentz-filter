const loop = lorentz;

const imgs_length = 20;

let cap, src, dst;
let vmask = [];
let hmask = [];
let matvec;
let imgs = [];

function init() {
  // メモリ確保
  cap = new cv.VideoCapture(camera);
  src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  dst = new cv.Mat(); // 出力画像

  // マスク
  const mask_width = Math.round(camera.width / imgs_length);
  for (let i = 0; i < imgs_length; i++) {
    const rect = new cv.Rect(mask_width * i, 0, mask_width, camera.height);
    vmask.push(rect);
  }

  // 初期値を代入
  cap.read(src);
  dst = src.clone();
  for (let i = 0; i < imgs_length; i++) {
    imgs.push(src.clone());
  }
}

// -----------------
// 時空間をミックス
// -----------------
function lorentz() {
  matvec = new cv.MatVector();
  cap.read(src); // カメラ画像をキャプチャ

  imgs = pushBackKeepLength(imgs, src.clone());

  imgs.forEach((img, i) => matvec.push_back(img.roi(vmask[i])));
  cv.hconcat(matvec, dst);

  cv.imshow("canvasOutput", dst); // 画像出力
  matvec.delete();
}

function pushBackKeepLength(arr, add) {
  let top = new cv.Mat();
  let rest = [];
  [top, ...rest] = arr;
  top.delete();
  return [...rest, add];
}

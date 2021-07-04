// Cyclic
let l_imgs = [];
let l_pointer = 0;

let l_cap, l_src, l_dst, l_size;
let vmask = [];
let hmask = [];
let matvec;

function lorentz_init() {
  // メモリ確保
  l_cap = new cv.VideoCapture(camera);
  l_src = new cv.Mat(camera.height, camera.width, cv.CV_8UC4); // 入力画像
  l_dst = new cv.Mat(); // 出力画像
  l_size = new cv.Size(Math.round(camera.width * ratio), camera.height); // 出力画像のサイズ

  // マスク
  for (let i = 0; i < slitCount; i++) {
    const rect = new cv.Rect(slitWidth * i, 0, slitWidth, camera.height);
    vmask.push(rect);
  }

  // 初期値を代入
  l_cap.read(l_src);
  l_dst = l_src.clone();
  for (let i = 0; i < slitCount; i++) {
    l_imgs.push(l_src.clone());
  }
}

// -----------------
// 時空間をミックス
// -----------------
function lorentz() {
  l_cap.read(l_imgs[l_pointer]); // カメラ画像をキャプチャ

  matvec = new cv.MatVector();
  for (let i = 0; i < slitCount; i++) {
    matvec.push_back(l_imgs[(l_pointer - i + slitCount) % slitCount].roi(vmask[i]));
  }
  cv.hconcat(matvec, l_dst);
  matvec.delete();

  cv.resize(l_dst, l_dst, l_size, 0, 0, cv.INTER_AREA);

  cv.imshow("canvasOutput", l_dst); // 画像出力
  l_pointer = (l_pointer + 1) % slitCount;
}

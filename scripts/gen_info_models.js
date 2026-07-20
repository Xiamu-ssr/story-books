// 《眼见为虚》3D 模型生成 —— 精细版，与页面内容强相关
// 配色：暖金 0xc9a84c / 木色 0x8b5a2b / 深棕 0x4a4035 / 暗棕 0x2c2418
// 点缀：墨青 0x2f5f6b / 绯红 0xb8423a
// node scripts/gen_info_models.js

const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.FileReader = dom.window.FileReader;
global.Blob = dom.window.Blob;
global.URL = dom.window.URL;

const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const fs = require('fs');
const path = require('path');

const GOLD = 0xc9a84c, WOOD = 0x8b5a2b, BROWN = 0x4a4035, DARK = 0x2c2418;
const TEAL = 0x2f5f6b, RED = 0xb8423a;

function mat(color, opt = {}) {
  return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.2 }, opt));
}
function metal(color, opt = {}) {
  return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.3, metalness: 0.7 }, opt));
}

function exportGLB(scene, name) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    const outputPath = path.join(__dirname, `../assets/models/${name}.glb`);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    exporter.parse(scene, (result) => {
      if (result instanceof ArrayBuffer) {
        fs.writeFileSync(outputPath, Buffer.from(result));
        console.log(`✓ ${name}.glb (${fs.statSync(outputPath).size} bytes)`);
        resolve();
      } else reject(new Error('Export failed'));
    }, reject, { binary: true });
  });
}

// 1. 烽火台 beacon_fire —— 石台 + 顶部火盆火焰
function createBeaconFire() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 基座（下宽上窄的石台）
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.35, 8), mat(BROWN, { roughness: 0.8 }));
  base.position.y = 0.17; g.add(base);
  const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 1.0, 8), mat(WOOD, { roughness: 0.75 }));
  mid.position.y = 0.85; g.add(mid);
  // 砖块纹路
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.1), mat(DARK, { roughness: 0.85 }));
    brick.position.set(Math.cos(a) * 0.66, 0.55, Math.sin(a) * 0.66);
    brick.rotation.y = -a;
    g.add(brick);
  }
  // 顶部雉堞
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.16), mat(BROWN, { roughness: 0.8 }));
    merlon.position.set(Math.cos(a) * 0.52, 1.45, Math.sin(a) * 0.52);
    merlon.rotation.y = -a;
    g.add(merlon);
  }
  // 火盆
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.25, 0.25, 16), metal(DARK, { metalness: 0.6 }));
  bowl.position.y = 1.62; g.add(bowl);
  // 火焰（三层锥体，内亮外暗）
  const flame1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 12),
    mat(RED, { emissive: 0xcc2200, emissiveIntensity: 0.9, roughness: 0.4 }));
  flame1.position.y = 2.05; g.add(flame1);
  const flame2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 12),
    mat(0xff8800, { emissive: 0xff6600, emissiveIntensity: 1.0, roughness: 0.3 }));
  flame2.position.y = 2.1; g.add(flame2);
  const flame3 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 12),
    mat(GOLD, { emissive: 0xffcc44, emissiveIntensity: 1.2, roughness: 0.2 }));
  flame3.position.y = 2.12; g.add(flame3);
  // 一缕烟
  const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8),
    mat(0x888888, { transparent: true, opacity: 0.35 }));
  smoke.position.set(0.12, 2.5, 0); smoke.scale.set(1, 1.6, 1); g.add(smoke);

  g.rotation.y = Math.PI / 8;
  scene.add(g);
  return scene;
}

// 2. 手抄经卷 / 锁链书 manuscript —— 摊开的厚书 + 锁链
function createManuscript() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 两页摊开的书
  const pageMat = mat(0xe8dcc0, { roughness: 0.85 });
  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 1.15), pageMat);
  leftPage.position.set(-0.42, 0.1, 0); leftPage.rotation.z = 0.12; g.add(leftPage);
  const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 1.15), pageMat);
  rightPage.position.set(0.42, 0.1, 0); rightPage.rotation.z = -0.12; g.add(rightPage);
  // 书脊/封面
  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.1, 1.3), mat(WOOD, { roughness: 0.7 }));
  cover.position.y = 0.0; g.add(cover);
  // 封面压边
  const edge = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.02, 1.15), metal(GOLD, { metalness: 0.8 }));
  edge.position.y = -0.055; g.add(edge);
  // 页面文字行
  for (let r = 0; r < 6; r++) {
    const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.005, 0.035), mat(DARK, { roughness: 0.6 }));
    line1.position.set(-0.42, 0.135 + r * 0.001, -0.42 + r * 0.17);
    line1.rotation.z = 0.12; g.add(line1);
    const line2 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.005, 0.035), mat(DARK, { roughness: 0.6 }));
    line2.position.set(0.42, 0.135 + r * 0.001, -0.42 + r * 0.17);
    line2.rotation.z = -0.12; g.add(line2);
  }
  // 首字红色（中世纪彩绘）
  const rubric = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.008, 0.12), mat(RED, { roughness: 0.5 }));
  rubric.position.set(-0.62, 0.14, -0.42); rubric.rotation.z = 0.12; g.add(rubric);
  // 锁链：跨过书本
  for (let i = 0; i < 9; i++) {
    const link = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), metal(0x777777, { metalness: 0.9, roughness: 0.25 }));
    link.position.set(-0.8 + i * 0.2, 0.3, 0.15 * Math.sin(i * 0.9));
    link.rotation.y = i % 2 ? Math.PI / 2 : 0;
    link.rotation.x = Math.PI / 6;
    g.add(link);
  }
  // 挂锁
  const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.08), metal(GOLD, { metalness: 0.85, roughness: 0.25 }));
  lockBody.position.set(0.95, 0.18, 0.3); g.add(lockBody);
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 8, 16, Math.PI), metal(0x999999, { metalness: 0.9 }));
  shackle.position.set(0.95, 0.3, 0.3); g.add(shackle);

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// 3. 印刷机 printing_press —— 螺旋压杆 + 压盘 + 活字盘
function createPrintingPress() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 两根立柱 + 顶梁
  [-0.55, 0.55].forEach(x => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.9, 0.16), mat(WOOD, { roughness: 0.65 }));
    post.position.set(x, 0.95, 0); g.add(post);
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, 0.2), mat(WOOD, { roughness: 0.65 }));
  beam.position.y = 1.85; g.add(beam);
  // 底座
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 0.9), mat(DARK, { roughness: 0.7 }));
  base.position.y = 0.07; g.add(base);
  // 大螺旋杆
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.0, 12), metal(DARK, { metalness: 0.6 }));
  screw.position.y = 1.25; g.add(screw);
  // 螺旋纹理
  const thread = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 24), metal(GOLD, { metalness: 0.8 }));
  thread.rotation.x = Math.PI / 2; thread.position.y = 1.35; g.add(thread);
  const thread2 = thread.clone(); thread2.position.y = 1.15; g.add(thread2);
  // 摇柄
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), mat(WOOD));
  handle.rotation.z = Math.PI / 2; handle.position.y = 1.6; g.add(handle);
  [-0.45, 0.45].forEach(x => {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), mat(RED, { roughness: 0.4 }));
    knob.position.set(x, 1.6, 0); g.add(knob);
  });
  // 压盘
  const platen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.55), metal(DARK, { metalness: 0.5 }));
  platen.position.y = 0.72; g.add(platen);
  // 活字盘（带凸起小字钉）
  const typeTray = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.45), mat(BROWN));
  typeTray.position.y = 0.35; g.add(typeTray);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
    const type = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.06), metal(GOLD, { metalness: 0.75 }));
    type.position.set(-0.22 + c * 0.11, 0.41, -0.13 + r * 0.13); g.add(type);
  }
  // 一张刚印好的纸
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.01, 0.6), mat(0xf5efe0, { roughness: 0.9 }));
  paper.position.set(0.75, 0.2, 0.3); paper.rotation.y = 0.4; g.add(paper);

  g.rotation.y = Math.PI / 7;
  scene.add(g);
  return scene;
}

// 4. 报纸 newspaper —— 一叠报纸 + 顶部展开的一份（夸张大标题区）
function createNewspaper() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  const paperMat = mat(0xf0ead8, { roughness: 0.85 });
  // 一叠报纸
  for (let i = 0; i < 5; i++) {
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.8), paperMat);
    sheet.position.y = 0.05 + i * 0.045;
    sheet.rotation.y = (i % 2 ? -1 : 1) * 0.04;
    g.add(sheet);
  }
  // 展开的一份（立起来）
  const front = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.02, 0.85), paperMat);
  front.position.set(0, 0.75, -0.15); front.rotation.x = -Math.PI / 2 + 0.35;
  g.add(front);
  // 大标题（黑色块，'标题党'）
  const headline = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.005, 0.14), mat(DARK, { roughness: 0.5 }));
  headline.position.set(0, 0.86, 0.02); headline.rotation.x = 0.35;
  g.add(headline);
  // 黄色小孩漫画条（黄色新闻的标志）
  const yellowKid = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.005, 0.35), mat(0xf7d51d, { roughness: 0.5 }));
  yellowKid.position.set(-0.35, 0.78, 0.12); yellowKid.rotation.x = 0.35;
  g.add(yellowKid);
  // 图片区 + 文字栏
  const photo = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.005, 0.3), mat(TEAL, { roughness: 0.6 }));
  photo.position.set(0.28, 0.72, 0.13); photo.rotation.x = 0.35; g.add(photo);
  for (let r = 0; r < 4; r++) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.005, 0.03), mat(0x555044, { roughness: 0.6 }));
    col.position.set(-0.32, 0.62 - r * 0.075, 0.19 + r * 0.028); col.rotation.x = 0.35;
    g.add(col);
    const col2 = col.clone(); col2.position.x = 0.3; g.add(col2);
  }
  // 卷起的报纸筒
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 16), paperMat);
  roll.rotation.z = Math.PI / 2; roll.position.set(0.1, 0.28, 0.55); g.add(roll);
  const rollBand = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.015, 8, 16), mat(RED));
  rollBand.rotation.y = Math.PI / 2; rollBand.position.set(0.1, 0.28, 0.55); g.add(rollBand);

  g.rotation.y = Math.PI / 8;
  scene.add(g);
  return scene;
}

// 5. 老式收音机 radio —— 木壳 + 喇叭布纹 + 调谐窗 + 旋钮 + 电波
function createRadio() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 木壳（圆角箱体）
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.55), mat(WOOD, { roughness: 0.55 }));
  body.position.y = 0.55; g.add(body);
  // 顶部弧形
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.275, 1.5, 24, 1, false, 0, Math.PI), mat(WOOD, { roughness: 0.55 }));
  top.rotation.z = Math.PI / 2; top.position.y = 1.03; g.add(top);
  // 喇叭格栅（左）
  const grill = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24), mat(DARK, { roughness: 0.7 }));
  grill.rotation.x = Math.PI / 2; grill.position.set(-0.4, 0.6, 0.28); g.add(grill);
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.03, 0.05), mat(GOLD, { metalness: 0.6, roughness: 0.35 }));
    bar.position.set(-0.4, 0.42 + i * 0.09, 0.29); g.add(bar);
  }
  // 调谐窗（右上，墨青发光）
  const dial = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.04), mat(TEAL, { emissive: 0x1a3f47, emissiveIntensity: 0.7, roughness: 0.3 }));
  dial.position.set(0.38, 0.78, 0.28); g.add(dial);
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.2, 0.05), mat(RED, { emissive: 0x661111, emissiveIntensity: 0.5 }));
  needle.position.set(0.45, 0.78, 0.29); g.add(needle);
  // 两个旋钮
  [0.18, 0.58].forEach(x => {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16), metal(GOLD, { metalness: 0.75 }));
    knob.rotation.x = Math.PI / 2; knob.position.set(x, 0.35, 0.28); g.add(knob);
  });
  // 底座脚
  [-0.5, 0.5].forEach(x => {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.4), mat(DARK));
    foot.position.set(x, 0.05, 0); g.add(foot);
  });
  // 电波（三道弧，向右扩散）
  for (let i = 1; i <= 3; i++) {
    const wave = new THREE.Mesh(new THREE.TorusGeometry(0.18 * i, 0.015, 8, 24, Math.PI * 0.8),
      mat(TEAL, { transparent: true, opacity: 0.75 - i * 0.18, emissive: 0x1a3f47, emissiveIntensity: 0.4 }));
    wave.rotation.y = Math.PI / 2; wave.rotation.z = -Math.PI * 0.4;
    wave.position.set(0.95 + i * 0.08, 0.9, 0);
    g.add(wave);
  }

  g.rotation.y = -Math.PI / 9;
  scene.add(g);
  return scene;
}

// 6. 电视机 television —— CRT 机身 + 屏幕辩论双人影 + 兔耳天线
function createTelevision() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 机身
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.0, 0.75), mat(BROWN, { roughness: 0.5 }));
  body.position.y = 0.72; g.add(body);
  // 屏幕（微微凸起，墨青辉光）
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.08),
    mat(TEAL, { emissive: 0x2a5a66, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.4 }));
  screen.position.set(-0.12, 0.75, 0.37); g.add(screen);
  // 屏幕内：两个辩论者剪影（一金一暗，肯尼迪 vs 尼克松）
  const fig1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), mat(GOLD, { emissive: 0x554411, emissiveIntensity: 0.6 }));
  fig1.position.set(-0.3, 0.82, 0.42); g.add(fig1);
  const body1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.22, 10), mat(GOLD, { emissive: 0x554411, emissiveIntensity: 0.5 }));
  body1.position.set(-0.3, 0.62, 0.42); g.add(body1);
  const fig2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), mat(0x445566, { emissive: 0x112233, emissiveIntensity: 0.5 }));
  fig2.position.set(0.08, 0.8, 0.42); g.add(fig2);
  const body2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.2, 10), mat(0x445566, { emissive: 0x112233, emissiveIntensity: 0.4 }));
  body2.position.set(0.08, 0.62, 0.42); g.add(body2);
  // 右侧旋钮面板
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.04), mat(DARK, { roughness: 0.6 }));
  panel.position.set(0.52, 0.75, 0.37); g.add(panel);
  [0.9, 0.62].forEach(y => {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 14), metal(GOLD));
    knob.rotation.x = Math.PI / 2; knob.position.set(0.52, y, 0.4); g.add(knob);
  });
  // 兔耳天线
  [-0.5, 0.5].forEach(s => {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.008, 0.85, 8), metal(0x999999, { metalness: 0.9 }));
    ear.position.set(s * 0.3, 1.6, 0); ear.rotation.z = s * 0.5; g.add(ear);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), metal(GOLD));
    tip.position.set(s * 0.3 + Math.sin(s * 0.5) * -0.42, 1.6 + Math.cos(s * 0.5) * 0.42, 0); g.add(tip);
  });
  // 四条腿
  [[-0.5, 0.25], [0.5, 0.25], [-0.5, -0.25], [0.5, -0.25]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.35, 8), mat(WOOD));
    leg.position.set(x, 0.17, z); g.add(leg);
  });

  g.rotation.y = Math.PI / 8;
  scene.add(g);
  return scene;
}

// 7. 智能手机 smartphone —— 大屏手机 + 屏幕信息流（彩色碎块）+ 顶部信号
function createSmartphone() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 机身
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.5, 0.09), metal(DARK, { metalness: 0.6, roughness: 0.35 }));
  g.add(body);
  // 屏幕（墨青底）
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.34, 0.02),
    mat(0x101c22, { emissive: 0x0d222b, emissiveIntensity: 0.8, roughness: 0.15 }));
  screen.position.z = 0.055; g.add(screen);
  // 信息流：彩色卡片（真假混杂）
  const colors = [GOLD, TEAL, RED, TEAL, GOLD, RED, TEAL, GOLD];
  colors.forEach((c, i) => {
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.012),
      mat(c, { emissive: c, emissiveIntensity: 0.35, roughness: 0.4 }));
    card.position.set(0, 0.52 - i * 0.155, 0.07);
    g.add(card);
  });
  // 前置摄像头 + 听筒
  const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), mat(0x000000, { roughness: 0.2 }));
  cam.rotation.x = Math.PI / 2; cam.position.set(0.12, 0.68, 0.06); g.add(cam);
  const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.015), mat(0x333333));
  speaker.position.set(-0.05, 0.68, 0.06); g.add(speaker);
  // 信号波纹（顶部）
  for (let i = 1; i <= 3; i++) {
    const wave = new THREE.Mesh(new THREE.TorusGeometry(0.1 * i, 0.012, 8, 20, Math.PI),
      mat(TEAL, { transparent: true, opacity: 0.7 - i * 0.15, emissive: 0x1a3f47, emissiveIntensity: 0.5 }));
    wave.position.set(0, 0.92, 0); g.add(wave);
  }
  // 周围漂浮的小手机（人人自媒体）
  const mini1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.03), metal(DARK, { metalness: 0.5 }));
  mini1.position.set(-0.62, 0.4, -0.15); mini1.rotation.z = 0.3; g.add(mini1);
  const mini1s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.25, 0.01), mat(TEAL, { emissive: 0x1a3f47, emissiveIntensity: 0.6 }));
  mini1s.position.set(-0.62, 0.4, -0.13); mini1s.rotation.z = 0.3; g.add(mini1s);
  const mini2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.03), metal(DARK, { metalness: 0.5 }));
  mini2.position.set(0.6, -0.35, -0.1); mini2.rotation.z = -0.4; g.add(mini2);
  const mini2s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.25, 0.01), mat(GOLD, { emissive: 0x554411, emissiveIntensity: 0.6 }));
  mini2s.position.set(0.6, -0.35, -0.08); mini2s.rotation.z = -0.4; g.add(mini2s);

  g.rotation.y = Math.PI / 10;
  g.rotation.x = -Math.PI / 24;
  scene.add(g);
  return scene;
}

// 8. 算法 algorithm —— 服务器塔 + 齿轮 + 流向手机的硬币
function createAlgorithm() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 服务器机架
  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.6), mat(DARK, { metalness: 0.5, roughness: 0.4 }));
  rack.position.y = 0.8; g.add(rack);
  // 服务器层 + 指示灯
  for (let i = 0; i < 5; i++) {
    const unit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.62), mat(BROWN, { metalness: 0.4, roughness: 0.5 }));
    unit.position.y = 0.25 + i * 0.29; g.add(unit);
    for (let j = 0; j < 4; j++) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02),
        mat(j % 2 ? TEAL : GOLD, { emissive: j % 2 ? 0x1a3f47 : 0x554411, emissiveIntensity: 0.9 }));
      led.position.set(-0.28 + j * 0.18, 0.25 + i * 0.29, 0.32); g.add(led);
    }
  }
  // 顶部齿轮（算法）
  const gearMat = metal(GOLD, { metalness: 0.8 });
  const gearBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24), gearMat);
  gearBody.rotation.x = Math.PI / 2; gearBody.position.set(-0.1, 1.85, 0); g.add(gearBody);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.08), gearMat);
    tooth.position.set(-0.1 + Math.cos(a) * 0.33, 1.85 + Math.sin(a) * 0.33, 0);
    tooth.rotation.z = a; g.add(tooth);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), metal(RED, { metalness: 0.6 }));
  hub.rotation.x = Math.PI / 2; hub.position.set(-0.1, 1.85, 0); g.add(hub);
  // 小齿轮
  const small = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 16), metal(0x999999, { metalness: 0.85 }));
  small.rotation.x = Math.PI / 2; small.position.set(0.38, 1.68, 0); g.add(small);
  // 流向手机的硬币流（看得越久越赚钱）
  for (let i = 0; i < 5; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16),
      metal(GOLD, { metalness: 0.85, emissive: 0x443300, emissiveIntensity: 0.4 }));
    coin.rotation.x = Math.PI / 2 + i * 0.3;
    coin.position.set(0.75 + i * 0.12, 1.2 - i * 0.16, 0.15);
    g.add(coin);
  }
  // 接收的手机
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.05), metal(DARK, { metalness: 0.6 }));
  phone.position.set(1.35, 0.35, 0.15); phone.rotation.z = -0.15; g.add(phone);
  const pscreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.47, 0.02), mat(TEAL, { emissive: 0x1a3f47, emissiveIntensity: 0.7 }));
  pscreen.position.set(1.35, 0.35, 0.18); pscreen.rotation.z = -0.15; g.add(pscreen);

  g.rotation.y = -Math.PI / 7;
  scene.add(g);
  return scene;
}

// 9. 过滤气泡 filter_bubble —— 大气泡裹小人，泡内屏幕同色，泡外多彩世界
function createFilterBubble() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 透明大气泡
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32),
    mat(TEAL, { transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.6, emissive: 0x14333b, emissiveIntensity: 0.3 }));
  bubble.position.y = 0.9; g.add(bubble);
  // 高光
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12),
    mat(0xffffff, { transparent: true, opacity: 0.5, emissive: 0xffffff, emissiveIntensity: 0.5 }));
  shine.position.set(-0.4, 1.35, 0.55); g.add(shine);
  // 泡内的人
  const person = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.5, 10), mat(GOLD, { roughness: 0.5 }));
  person.position.y = 0.55; g.add(person);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), mat(0xd4a574, { roughness: 0.6 }));
  head.position.y = 0.9; g.add(head);
  // 泡内壁一圈相同屏幕（都是同一个内容——认同的观点）
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const scr = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.02),
      mat(TEAL, { emissive: 0x1f4a55, emissiveIntensity: 0.8, roughness: 0.3 }));
    scr.position.set(Math.cos(a) * 0.68, 0.9 + Math.sin(i * 1.3) * 0.15, Math.sin(a) * 0.68);
    scr.lookAt(0, 0.85, 0);
    g.add(scr);
    // 屏幕上一模一样的内容块
    const content = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.01), mat(GOLD, { emissive: 0x554411, emissiveIntensity: 0.6 }));
    content.position.copy(scr.position).multiplyScalar(0.97);
    content.position.y = scr.position.y;
    content.lookAt(0, 0.85, 0);
    g.add(content);
  }
  // 泡外多彩世界（不同颜色的小方块，被隔绝）
  const outerColors = [RED, GOLD, 0x4a6fa5, 0x2c5f2e, 0x8a4a6a, 0xf7d51d];
  outerColors.forEach((c, i) => {
    const a = (i / outerColors.length) * Math.PI * 2 + 0.4;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14),
      mat(c, { roughness: 0.45, emissive: c, emissiveIntensity: 0.25 }));
    cube.position.set(Math.cos(a) * 1.35, 0.6 + (i % 3) * 0.45, Math.sin(a) * 1.35);
    cube.rotation.set(i, i * 0.7, 0);
    g.add(cube);
  });

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// 10. 假新闻 fake_news —— 火箭（假）vs 乌龟（真）
function createFakeNews() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 火箭（假新闻，快而炫）
  const rocket = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.6, 14), metal(RED, { metalness: 0.6, roughness: 0.3 }));
  rocket.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 14), metal(GOLD, { metalness: 0.8, roughness: 0.2 }));
  nose.position.y = 0.44; rocket.add(nose);
  const window = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), mat(TEAL, { emissive: 0x1f4a55, emissiveIntensity: 0.8 }));
  window.rotation.x = Math.PI / 2; window.position.set(0, 0.15, 0.15); rocket.add(window);
  // 尾翼
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, 0.16), metal(RED, { metalness: 0.6 }));
    fin.position.set(Math.cos(a) * 0.16, -0.25, Math.sin(a) * 0.16);
    fin.rotation.y = -a;
    rocket.add(fin);
  }
  // 尾焰
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 12),
    mat(0xff8800, { emissive: 0xff6600, emissiveIntensity: 1.1, transparent: true, opacity: 0.9 }));
  flame.position.y = -0.5; flame.rotation.x = Math.PI; rocket.add(flame);
  rocket.position.set(-0.7, 0.9, 0);
  rocket.rotation.z = Math.PI / 2 - 0.25;
  g.add(rocket);

  // 火箭飞过的火星轨迹
  for (let i = 0; i < 4; i++) {
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8),
      mat(RED, { emissive: 0xaa1100, emissiveIntensity: 0.9 }));
    spark.position.set(-1.25 - i * 0.18, 0.85 - i * 0.06, 0);
    g.add(spark);
  }

  // 乌龟（真相，慢而稳）
  const turtle = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x3a5a3a, { roughness: 0.7 }));
  shell.scale.set(1.2, 0.8, 1); turtle.add(shell);
  const shellRim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.08, 16), mat(WOOD, { roughness: 0.7 }));
  turtle.add(shellRim);
  const thead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), mat(0x6a8a5a, { roughness: 0.6 }));
  thead.position.set(0.38, 0.02, 0); turtle.add(thead);
  const teye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), mat(0x000000));
  teye.position.set(0.44, 0.06, 0.04); turtle.add(teye);
  [[0.18, 0.16], [0.18, -0.16], [-0.18, 0.16], [-0.18, -0.16]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.12, 8), mat(0x6a8a5a, { roughness: 0.6 }));
    leg.position.set(x, -0.08, z); turtle.add(leg);
  });
  turtle.position.set(0.55, 0.12, 0.1);
  g.add(turtle);

  // 终点线（远处的旗）
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8), metal(0x999999, { metalness: 0.8 }));
  pole.position.set(1.25, 0.4, -0.3); g.add(pole);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.01), mat(GOLD, { roughness: 0.5 }));
  flag.position.set(1.38, 0.72, -0.3); g.add(flag);

  // 地面
  const ground = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.9), mat(BROWN, { roughness: 0.8 }));
  ground.position.y = -0.03; g.add(ground);

  g.rotation.y = Math.PI / 9;
  scene.add(g);
  return scene;
}

// 11. 深度伪造 deepfake —— 两面人面具（一面真一面像素化假）
function createDeepfake() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 头部主体（半球真脸）
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), mat(0xd4a574, { roughness: 0.55 }));
  head.position.y = 0.75; g.add(head);
  // 真侧五官
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), mat(0xffffff, { roughness: 0.3 }));
  eyeL.position.set(-0.2, 0.85, 0.47); g.add(eyeL);
  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), mat(DARK));
  pupilL.position.set(-0.2, 0.85, 0.52); g.add(pupilL);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 8), mat(0xc09060, { roughness: 0.6 }));
  nose.rotation.x = Math.PI / 2; nose.position.set(-0.02, 0.72, 0.55); g.add(nose);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.02), mat(RED, { roughness: 0.5 }));
  mouth.position.set(-0.05, 0.55, 0.5); mouth.rotation.z = 0.1; g.add(mouth);

  // 假侧：像素方块拼成的半张脸（错位漂浮）
  const pxColors = [0xd4a574, 0xc09060, 0xa87848, TEAL, 0x88aabb];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      const cIdx = Math.floor(Math.random() * pxColors.length);
      const px = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.06),
        mat(pxColors[cIdx], { roughness: 0.4, emissive: cIdx === 3 ? 0x14333b : 0x000000, emissiveIntensity: 0.4 }));
      px.position.set(0.08 + c * 0.12 + (r % 2) * 0.04, 0.45 + r * 0.13, 0.48 - c * 0.05 + r * 0.02);
      px.rotation.set(Math.random() * 0.3, Math.random() * 0.4, Math.random() * 0.3);
      g.add(px);
    }
  }
  // 假侧一只发光的像素眼
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05),
    mat(TEAL, { emissive: 0x1f5a66, emissiveIntensity: 1.0, roughness: 0.2 }));
  eyeR.position.set(0.28, 0.88, 0.5); g.add(eyeR);

  // 放大镜（审视）
  const lens = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 10, 28), metal(GOLD, { metalness: 0.85 }));
  lens.position.set(-0.45, 0.4, 0.75); lens.rotation.x = 0.2; g.add(lens);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24),
    mat(0xbbddff, { transparent: true, opacity: 0.3, roughness: 0.1 }));
  glass.rotation.x = Math.PI / 2 - 0.2; glass.position.set(-0.45, 0.4, 0.75); g.add(glass);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), mat(WOOD, { roughness: 0.6 }));
  stick.position.set(-0.28, 0.18, 0.75); stick.rotation.z = -0.7; g.add(stick);

  // 底座
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.15, 20), mat(BROWN, { roughness: 0.7 }));
  base.position.y = 0.07; g.add(base);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// 12. 灯塔 lighthouse —— 条纹塔身 + 发光灯室 + 旋转光束 + 锚
function createLighthouse() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 岩石基座
  const rock = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.3, 9), mat(BROWN, { roughness: 0.85 }));
  rock.position.y = 0.15; g.add(rock);
  // 塔身（红白条纹三段）
  const stripeCols = [0xf0ead8, RED, 0xf0ead8];
  stripeCols.forEach((c, i) => {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.32 - i * 0.045, 0.36 - i * 0.045, 0.5, 16), mat(c, { roughness: 0.55 }));
    seg.position.y = 0.55 + i * 0.5; g.add(seg);
  });
  // 塔身平台 + 栏杆
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 16), metal(DARK, { metalness: 0.5 }));
  deck.position.y = 1.83; g.add(deck);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6), metal(GOLD, { metalness: 0.8 }));
    rail.position.set(Math.cos(a) * 0.37, 1.95, Math.sin(a) * 0.37); g.add(rail);
  }
  // 灯室（发光）
  const lampRoom = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 12),
    mat(GOLD, { emissive: 0xffd866, emissiveIntensity: 1.3, transparent: true, opacity: 0.95, roughness: 0.2 }));
  lampRoom.position.y = 2.05; g.add(lampRoom);
  // 灯室顶
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.25, 12), mat(RED, { roughness: 0.4 }));
  roof.position.y = 2.33; g.add(roof);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), metal(GOLD, { metalness: 0.9 }));
  ball.position.y = 2.5; g.add(ball);
  // 旋转光束（两束）
  [0, Math.PI].forEach(a => {
    const beamGeo = new THREE.ConeGeometry(0.28, 1.6, 12, 1, true);
    const beam = new THREE.Mesh(beamGeo,
      mat(0xffe9a0, { emissive: 0xffd866, emissiveIntensity: 0.8, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    beam.rotation.z = Math.PI / 2;
    beam.rotation.y = a;
    beam.position.set(Math.cos(a) * 0.85, 2.05, Math.sin(a) * 0.85);
    g.add(beam);
  });
  // 锚（有锚的人）
  const anchor = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), metal(DARK, { metalness: 0.8, roughness: 0.3 }));
  anchor.add(shaft);
  const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8), metal(DARK, { metalness: 0.8 }));
  cross.rotation.z = Math.PI / 2; cross.position.y = 0.2; anchor.add(cross);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), metal(GOLD, { metalness: 0.85 }));
  ring.position.y = 0.3; anchor.add(ring);
  const arm = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 20, Math.PI), metal(DARK, { metalness: 0.8 }));
  arm.position.y = -0.22; arm.rotation.z = Math.PI; anchor.add(arm);
  [-0.16, 0.16].forEach(x => {
    const fluke = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), metal(DARK, { metalness: 0.8 }));
    fluke.position.set(x, -0.2, 0); fluke.rotation.z = x > 0 ? -0.6 : 0.6; anchor.add(fluke);
  });
  anchor.position.set(0.62, 0.4, 0.35); anchor.rotation.z = 0.25;
  g.add(anchor);

  g.rotation.y = -Math.PI / 8;
  scene.add(g);
  return scene;
}

async function main() {
  console.log('开始生成《眼见为虚》3D 模型...\n');
  await exportGLB(createBeaconFire(), 'beacon_fire');
  await exportGLB(createManuscript(), 'manuscript');
  await exportGLB(createPrintingPress(), 'printing_press');
  await exportGLB(createNewspaper(), 'newspaper');
  await exportGLB(createRadio(), 'radio');
  await exportGLB(createTelevision(), 'television');
  await exportGLB(createSmartphone(), 'smartphone');
  await exportGLB(createAlgorithm(), 'algorithm');
  await exportGLB(createFilterBubble(), 'filter_bubble');
  await exportGLB(createFakeNews(), 'fake_news');
  await exportGLB(createDeepfake(), 'deepfake');
  await exportGLB(createLighthouse(), 'lighthouse');
  console.log('\n全部完成！');
}

main().catch(e => { console.error(e); process.exit(1); });

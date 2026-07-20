// 生成《谁说了算》12 个 3D 模型
// cd /Users/xiamu/Code/wealth-stories && node scripts/gen_power_models.js

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

const GOLD = 0xc9a84c;
const WOOD = 0x8b5a2b;
const BROWN = 0x4a4035;
const DARK = 0x2c2418;
const SLATE = 0x4a6fa5;

function exportGLB(scene, name) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    const outputPath = path.join(__dirname, `../assets/models/${name}.glb`);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    exporter.parse(scene, (result) => {
      if (result instanceof ArrayBuffer) {
        fs.writeFileSync(outputPath, Buffer.from(result));
        console.log(`✓ ${name}.glb`);
        resolve();
      } else {
        reject(new Error('Export failed'));
      }
    }, reject, { binary: true });
  });
}

function mat(color, roughness = 0.4, metalness = 0.5, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
}

// 1. 长矛 spear —— 拳头的权力
function createSpear() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 木杆
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.2, 12), mat(WOOD, 0.7, 0.1));
  group.add(shaft);

  // 矛头（双刃菱形：两个背靠背圆锥）
  const headMat = mat(0xb8bcc4, 0.25, 0.9);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 4), headMat);
  tip.position.y = 1.27;
  group.add(tip);
  const tipBase = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), headMat);
  tipBase.rotation.x = Math.PI;
  tipBase.position.y = 1.01;
  group.add(tipBase);

  // 矛头下的红缨
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 8), mat(0xb8423a, 0.6, 0.1));
  tassel.rotation.x = Math.PI;
  tassel.position.y = 0.82;
  group.add(tassel);

  // 杆尾金属箍
  const butt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 12), mat(GOLD, 0.3, 0.8));
  butt.position.y = -1.12;
  group.add(butt);

  // 中段缠绕握把
  for (let i = 0; i < 5; i++) {
    const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 16), mat(DARK, 0.8, 0.1));
    wrap.rotation.x = Math.PI / 2;
    wrap.position.y = -0.15 + i * 0.07;
    group.add(wrap);
  }

  group.rotation.z = Math.PI / 5;
  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 2. 王冠 crown —— 世袭
function createCrown() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 基环
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.22, 32, 1, true), mat(GOLD, 0.25, 0.85, { side: THREE.DoubleSide }));
  group.add(band);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.035, 10, 32), mat(GOLD, 0.25, 0.85));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.11;
  group.add(rim);
  const rimTop = rim.clone();
  rimTop.position.y = 0.11;
  rimTop.scale.setScalar(0.55 / 0.58);
  group.add(rimTop);

  // 尖齿
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32, 4), mat(GOLD, 0.25, 0.85));
    spike.position.set(Math.cos(angle) * 0.52, 0.26, Math.sin(angle) * 0.52);
    group.add(spike);
    if (i % 2 === 0) {
      const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), mat(i % 4 === 0 ? 0xb8423a : SLATE, 0.15, 0.4, { emissive: i % 4 === 0 ? 0x330000 : 0x001133, emissiveIntensity: 0.4 }));
      jewel.position.set(Math.cos(angle) * 0.56, 0.02, Math.sin(angle) * 0.56);
      group.add(jewel);
    }
  }

  // 内衬红绒
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.18, 32), mat(0x7a2a2a, 0.9, 0));
  group.add(inner);

  group.position.y = -0.1;
  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// 3. 神授王冠 sun_crown —— 君权神授（王冠 + 太阳光芒）
function createSunCrown() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 太阳光盘（背后）
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 32), mat(GOLD, 0.3, 0.8, { emissive: 0x664400, emissiveIntensity: 0.25 }));
  disc.rotation.x = Math.PI / 2;
  disc.position.set(0, 0.35, -0.18);
  group.add(disc);

  // 光芒
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const ray = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 4), mat(GOLD, 0.3, 0.8, { emissive: 0x664400, emissiveIntensity: 0.3 }));
    ray.position.set(Math.cos(angle) * 0.78, 0.35 + Math.sin(angle) * 0.78, -0.18);
    ray.rotation.z = angle - Math.PI / 2;
    group.add(ray);
  }

  // 王冠基环
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.43, 0.18, 32, 1, true), mat(GOLD, 0.25, 0.85, { side: THREE.DoubleSide }));
  band.position.y = -0.35;
  group.add(band);

  // 尖齿
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.24, 4), mat(GOLD, 0.25, 0.85));
    spike.position.set(Math.cos(angle) * 0.38, -0.14, Math.sin(angle) * 0.38);
    group.add(spike);
  }

  // 顶端宝石
  const gem = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), mat(SLATE, 0.15, 0.5, { emissive: 0x112244, emissiveIntensity: 0.5 }));
  gem.position.set(0, -0.02, 0.4);
  group.add(gem);

  group.rotation.y = Math.PI / 7;
  scene.add(group);
  return scene;
}

// 4. 帝国版图 empire_map —— 秦始皇（卷起的地图 + 界碑）
function createEmpireMap() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 展开的地图（微曲：三段拼接）
  const mapMat = mat(0xe8dcc8, 0.8, 0);
  const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 1.0), mapMat);
  seg1.position.set(-0.55, 0, 0);
  seg1.rotation.z = 0.25;
  group.add(seg1);
  const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 1.0), mapMat);
  group.add(seg2);
  const seg3 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 1.0), mapMat);
  seg3.position.set(0.55, 0, 0);
  seg3.rotation.z = -0.25;
  group.add(seg3);

  // 地图上的山河纹（棕色线条）
  const lineMat = mat(BROWN, 0.6, 0.1);
  const river = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.012, 0.04), mat(SLATE, 0.5, 0.2));
  river.position.set(0, 0.015, 0.1);
  river.rotation.y = 0.3;
  group.add(river);
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 4), lineMat);
    m.position.set(-0.35 + i * 0.35, 0.06, -0.25);
    group.add(m);
  }

  // 长城（顶部一小段锯齿）
  for (let i = 0; i < 7; i++) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.04), mat(0x9a8a7a, 0.7, 0.1));
    wall.position.set(-0.45 + i * 0.15, 0.04, -0.42);
    group.add(wall);
  }

  // 中央界碑/印章（权力中心）
  const stele = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.4, 0.08), mat(BROWN, 0.5, 0.3));
  stele.position.set(0, 0.2, 0.05);
  group.add(stele);
  const sealTop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), mat(GOLD, 0.3, 0.8));
  sealTop.position.set(0, 0.42, 0.05);
  group.add(sealTop);

  // 放射道路（驰道）
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 3 + i * (Math.PI / 6);
    const road = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.01, 0.03), mat(0xb8a88a, 0.8, 0));
    road.position.set(Math.cos(angle) * 0.35, 0.012, 0.05 + Math.sin(angle) * 0.35);
    road.rotation.y = -angle;
    group.add(road);
  }

  group.rotation.y = Math.PI / 6;
  group.rotation.x = Math.PI / 10;
  scene.add(group);
  return scene;
}

// 5. 元老院 senate —— 半圆座
function createSenate() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 三排半圆大理石座
  for (let row = 0; row < 3; row++) {
    const r = 0.45 + row * 0.28;
    const bench = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.14, 32, 1, false, 0, Math.PI), mat(0xd8ccb8, 0.6, 0.1));
    bench.position.y = row * 0.16;
    group.add(bench);
  }

  // 座位上的元老（白袍小人）
  for (let row = 0; row < 3; row++) {
    const r = 0.45 + row * 0.28;
    const n = 3 + row * 2;
    for (let i = 0; i < n; i++) {
      const angle = (i + 0.5) / n * Math.PI;
      const person = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.16, 8), mat(0xf0ead8, 0.7, 0.05));
      person.position.set(Math.cos(angle) * r, row * 0.16 + 0.15, Math.sin(angle) * r);
      group.add(person);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), mat(0xd4a574, 0.6, 0));
      head.position.set(Math.cos(angle) * r, row * 0.16 + 0.27, Math.sin(angle) * r);
      group.add(head);
    }
  }

  // 中央发言台（两个执政官席位）
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.3, 8), mat(WOOD, 0.6, 0.2));
  podium.position.y = 0.15;
  group.add(podium);

  // 后墙立柱
  for (let i = -1; i <= 1; i++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.9, 12), mat(0xe8e0d0, 0.5, 0.1));
    col.position.set(i * 0.7, 0.45, -0.15);
    group.add(col);
  }

  group.rotation.y = Math.PI;
  group.position.z = 0.3;
  scene.add(group);
  return scene;
}

// 6. 大宪章 charter —— 卷轴 + 蜡封
function createCharter() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 展开的羊皮纸
  const paper = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.75), mat(0xeadfc0, 0.85, 0));
  group.add(paper);

  // 纸上文字行
  for (let i = 0; i < 6; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.85 - (i % 3) * 0.1, 0.008, 0.025), mat(DARK, 0.7, 0));
    line.position.set(-0.03, 0.015, -0.28 + i * 0.1);
    group.add(line);
  }

  // 两侧卷轴杆
  const rodMat = mat(WOOD, 0.5, 0.3);
  const rod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 12), rodMat);
  rod1.rotation.x = Math.PI / 2;
  rod1.position.set(-0.62, 0.06, 0);
  group.add(rod1);
  const rod2 = rod1.clone();
  rod2.position.x = 0.62;
  group.add(rod2);

  // 杆头金球
  const knobMat = mat(GOLD, 0.3, 0.8);
  [[-0.62, 0.45], [-0.62, -0.45], [0.62, 0.45], [0.62, -0.45]].forEach(([x, z]) => {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), knobMat);
    knob.position.set(x, 0.06, z);
    group.add(knob);
  });

  // 蜡封
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.04, 24), mat(0x9a2a2a, 0.35, 0.3));
  seal.position.set(0.28, 0.03, 0.18);
  group.add(seal);
  // 封印凹纹
  const sealMark = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), mat(0x6a1a1a, 0.4, 0.2));
  sealMark.rotation.x = Math.PI / 2;
  sealMark.position.set(0.28, 0.055, 0.18);
  group.add(sealMark);
  // 系绳
  const cord = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 0.5), mat(0x9a2a2a, 0.5, 0.1));
  cord.position.set(0.28, 0.012, -0.05);
  group.add(cord);

  group.rotation.y = Math.PI / 6;
  group.rotation.x = Math.PI / 12;
  scene.add(group);
  return scene;
}

// 7. 大革命 revolution —— 三色旗
function createRevolution() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 旗杆
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.9, 10), mat(WOOD, 0.6, 0.2));
  pole.position.y = 0;
  group.add(pole);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), mat(GOLD, 0.3, 0.8));
  finial.position.y = 0.98;
  group.add(finial);

  // 三色旗（蓝白红三条，微飘动）
  const stripeW = 0.24;
  const colors = [0x2a4a8a, 0xf0ead8, 0xb8423a];
  for (let s = 0; s < 3; s++) {
    for (let w = 0; w < 4; w++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(0.16, stripeW, 0.015), mat(colors[s], 0.7, 0.05));
      seg.position.set(0.11 + w * 0.155, 0.78 - s * stripeW - stripeW / 2 + 0.02, Math.sin(w * 1.2 + s) * 0.04);
      seg.rotation.y = Math.sin(w * 1.2) * 0.18;
      group.add(seg);
    }
  }

  // 底座（街垒石块）
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.4), mat(0x8a8578, 0.8, 0.05));
  base.position.y = -1.02;
  group.add(base);
  const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), mat(0x9a9588, 0.8, 0.05));
  base2.position.set(0.15, -0.9, 0.1);
  base2.rotation.y = 0.4;
  group.add(base2);

  group.rotation.y = Math.PI / 5;
  scene.add(group);
  return scene;
}

// 8. 投票箱 ballot_box
function createBallotBox() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 箱体（半透明玻璃感 → 用石板蓝实体 + 木纹底座）
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.6), mat(SLATE, 0.2, 0.4, { transparent: true, opacity: 0.55 }));
  box.position.y = 0.1;
  group.add(box);

  // 箱内选票
  for (let i = 0; i < 5; i++) {
    const vote = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.2), mat(0xf5f0e0, 0.8, 0));
    vote.position.set((Math.sin(i * 2.3) * 0.15), -0.15 + i * 0.06, Math.cos(i * 1.7) * 0.12);
    vote.rotation.y = i * 0.8;
    group.add(vote);
  }

  // 箱盖
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.64), mat(WOOD, 0.5, 0.3));
  lid.position.y = 0.49;
  group.add(lid);

  // 投递口
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.06), mat(DARK, 0.6, 0.2));
  slot.position.y = 0.535;
  group.add(slot);

  // 正投入的一张选票
  const voting = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.01, 0.18), mat(0xffffff, 0.7, 0));
  voting.position.set(0, 0.65, 0);
  voting.rotation.x = -0.5;
  group.add(voting);

  // 底座
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.7), mat(BROWN, 0.6, 0.2));
  base.position.y = -0.3;
  group.add(base);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 9. 三根柱子 three_pillars —— 枪/笔/钱
function createThreePillars() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 三根柱子
  const colGeo = new THREE.CylinderGeometry(0.13, 0.15, 1.1, 16);
  const colMat = mat(0xd8ccb8, 0.55, 0.15);
  [-0.45, 0, 0.45].forEach(x => {
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, 0, 0);
    group.add(col);
    // 柱头柱础
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.32), mat(GOLD, 0.3, 0.7));
    cap.position.set(x, 0.59, 0);
    group.add(cap);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.34), mat(BROWN, 0.6, 0.2));
    foot.position.set(x, -0.59, 0);
    group.add(foot);
  });

  // 柱 1 顶：步枪（枪杆子）
  const rifleBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.06), mat(DARK, 0.5, 0.5));
  rifleBody.position.set(-0.45, 0.72, 0);
  group.add(rifleBody);
  const rifleBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), mat(0x666666, 0.3, 0.8));
  rifleBarrel.rotation.z = Math.PI / 2;
  rifleBarrel.position.set(-0.45 + 0.35, 0.72, 0);
  group.add(rifleBarrel);

  // 柱 2 顶：羽毛笔（笔杆子）
  const quill = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.5, 6), mat(0xf0ead8, 0.6, 0.05));
  quill.position.set(0, 0.88, 0);
  quill.rotation.z = -0.5;
  group.add(quill);
  const quillTip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.12, 6), mat(GOLD, 0.3, 0.8));
  quillTip.position.set(0.22, 0.68, 0);
  quillTip.rotation.z = -0.5 + Math.PI;
  group.add(quillTip);

  // 柱 3 顶：钱袋（钱袋子）
  const bag = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), mat(WOOD, 0.7, 0.1));
  bag.scale.set(1, 1.15, 1);
  bag.position.set(0.45, 0.76, 0);
  group.add(bag);
  const bagKnot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.08, 8), mat(GOLD, 0.4, 0.7));
  bagKnot.position.set(0.45, 0.94, 0);
  group.add(bagKnot);

  // 顶部横梁（权力之座）
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.07, 0.4), mat(BROWN, 0.5, 0.3));
  beam.position.y = 1.12;
  group.add(beam);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 10. 公章 rubber_stamp —— 官僚的实权
function createRubberStamp() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 木柄
  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), mat(WOOD, 0.5, 0.2));
  handle.scale.set(1, 1.3, 1);
  handle.position.y = 0.45;
  group.add(handle);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.15, 12), mat(WOOD, 0.5, 0.2));
  neck.position.y = 0.22;
  group.add(neck);

  // 章体（金属+橡胶底）
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.18, 24), mat(GOLD, 0.3, 0.8));
  body.position.y = 0.05;
  group.add(body);
  const rubber = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24), mat(0x8a2a2a, 0.7, 0.1));
  rubber.position.y = -0.06;
  group.add(rubber);

  // 盖出的红色印迹（旁边纸上）
  const paper = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.02, 0.7), mat(0xf5f0e0, 0.85, 0));
  paper.position.set(0.1, -0.35, 0);
  group.add(paper);
  const stampMark = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.012, 24), mat(0xb8423a, 0.5, 0.1, { transparent: true, opacity: 0.85 }));
  stampMark.position.set(0.1, -0.33, 0.05);
  group.add(stampMark);
  const markRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 32), mat(0x8a1a1a, 0.5, 0.1));
  markRing.rotation.x = Math.PI / 2;
  markRing.position.set(0.1, -0.322, 0.05);
  group.add(markRing);

  // 文件堆
  for (let i = 0; i < 3; i++) {
    const doc = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.015, 0.6), mat(0xe8e0cc, 0.85, 0));
    doc.position.set(-0.55, -0.34 + i * 0.02, -0.05);
    doc.rotation.y = (i - 1) * 0.12;
    group.add(doc);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 11. AI 大脑 ai_brain
function createAIBrain() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 大脑主体（两个半球）
  const brainMat = mat(SLATE, 0.3, 0.5, { emissive: 0x0a1a33, emissiveIntensity: 0.4 });
  const hemiGeo = new THREE.SphereGeometry(0.32, 24, 24);
  hemiGeo.scale(0.85, 1, 1.1);
  const hemi1 = new THREE.Mesh(hemiGeo, brainMat);
  hemi1.position.x = -0.13;
  group.add(hemi1);
  const hemi2 = new THREE.Mesh(hemiGeo, brainMat);
  hemi2.position.x = 0.13;
  group.add(hemi2);

  // 脑回沟（环绕曲线段）
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const gyri = new THREE.Mesh(new THREE.TorusGeometry(0.2 + (i % 3) * 0.04, 0.022, 6, 16, Math.PI * 1.2), mat(0x6a8ac5, 0.35, 0.4, { emissive: 0x112244, emissiveIntensity: 0.4 }));
    gyri.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.22, Math.sin(angle * 1.7) * 0.15);
    gyri.rotation.set(angle, angle * 0.7, angle * 1.3);
    group.add(gyri);
  }

  // 电路节点
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), mat(GOLD, 0.2, 0.8, { emissive: 0x664400, emissiveIntensity: 0.6 }));
    node.position.set(Math.cos(angle) * 0.42, Math.sin(angle) * 0.3, Math.sin(angle * 2) * 0.2);
    group.add(node);
    // 连线
    const link = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 6), mat(GOLD, 0.3, 0.8, { emissive: 0x442200, emissiveIntensity: 0.4 }));
    link.position.set(Math.cos(angle) * 0.3, Math.sin(angle) * 0.2, Math.sin(angle * 2) * 0.12);
    link.rotation.z = angle + Math.PI / 2;
    group.add(link);
  }

  // 底座（芯片）
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), mat(DARK, 0.4, 0.6));
  chip.position.y = -0.45;
  group.add(chip);
  for (let i = -2; i <= 2; i++) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), mat(GOLD, 0.3, 0.8));
    pin.position.set(i * 0.1, -0.45, 0.28);
    group.add(pin);
    const pin2 = pin.clone();
    pin2.position.z = -0.28;
    group.add(pin2);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 12. 责任之灯 lantern_light —— 灯笼
function createLanternLight() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 灯罩（暖金发光圆柱）
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.55, 8, 1, true),
    mat(0xe8c87a, 0.6, 0.1, { emissive: 0xaa7722, emissiveIntensity: 0.7, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  group.add(shade);

  // 内部光芯
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), mat(0xffd88a, 0.3, 0.2, { emissive: 0xffaa33, emissiveIntensity: 1.2 }));
  group.add(flame);

  // 上下盖
  const capMat = mat(DARK, 0.4, 0.6);
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 8), capMat);
  capTop.position.y = 0.3;
  group.add(capTop);
  const capBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 8), capMat);
  capBottom.position.y = -0.3;
  group.add(capBottom);

  // 骨架竖条
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 6), capMat);
    rib.position.set(Math.cos(angle) * 0.31, 0, Math.sin(angle) * 0.31);
    group.add(rib);
  }

  // 提手
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 24, Math.PI), capMat);
  handle.position.y = 0.36;
  group.add(handle);

  // 垂穗
  const tasselCord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6), mat(GOLD, 0.4, 0.7));
  tasselCord.position.y = -0.4;
  group.add(tasselCord);
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), mat(0xb8423a, 0.6, 0.1));
  tassel.rotation.x = Math.PI;
  tassel.position.y = -0.55;
  group.add(tassel);

  // 周围的光点（聚集的人们/星光）
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), mat(0xffe0a0, 0.3, 0.3, { emissive: 0xffbb44, emissiveIntensity: 0.9 }));
    spark.position.set(Math.cos(angle) * 0.6, Math.sin(angle * 2) * 0.25, Math.sin(angle) * 0.6);
    group.add(spark);
  }

  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

async function main() {
  console.log('开始生成《谁说了算》12 个 3D 模型...\n');
  await exportGLB(createSpear(), 'spear');
  await exportGLB(createCrown(), 'crown');
  await exportGLB(createSunCrown(), 'sun_crown');
  await exportGLB(createEmpireMap(), 'empire_map');
  await exportGLB(createSenate(), 'senate');
  await exportGLB(createCharter(), 'charter');
  await exportGLB(createRevolution(), 'revolution');
  await exportGLB(createBallotBox(), 'ballot_box');
  await exportGLB(createThreePillars(), 'three_pillars');
  await exportGLB(createRubberStamp(), 'rubber_stamp');
  await exportGLB(createAIBrain(), 'ai_brain');
  await exportGLB(createLanternLight(), 'lantern_light');
  console.log('\n全部完成！');
}

main().catch(console.error);

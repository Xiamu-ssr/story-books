// 《阶级的秘密》18 个 3D 模型 — 与页面内容强相关
// 风格沿用书架：暖金/木色/深棕 + 少量青色点缀
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

const GOLD = 0xc9a84c, WOOD = 0x8b5a2b, BROWN = 0x4a4035, DARK = 0x2c2418,
      CREAM = 0xe8dcc8, TEAL = 0x2a7a7a, RED = 0xb8423a, PAPER = 0xf5f0e8;

function std(color, opt = {}) {
  return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.2 }, opt));
}

// ========== 1. bison 野牛 ==========
function createBison() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();
  const fur = std(0x6b4a2f, { roughness: 0.9 });
  const darkFur = std(DARK, { roughness: 0.95 });

  // 躯干（前高后低的野牛轮廓）
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), fur);
  body.scale.set(1.3, 0.9, 0.8);
  g.add(body);
  // 驼峰
  const hump = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), darkFur);
  hump.position.set(0.35, 0.35, 0);
  g.add(hump);
  // 头
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), darkFur);
  head.scale.set(1.1, 0.9, 0.8);
  head.position.set(0.75, -0.05, 0);
  g.add(head);
  // 嘴部
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), std(0x3a2e20));
  snout.position.set(0.95, -0.15, 0);
  g.add(snout);
  // 角
  const hornMat = std(CREAM, { roughness: 0.4 });
  [-1, 1].forEach(s => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 8), hornMat);
    horn.position.set(0.75, 0.15, s * 0.22);
    horn.rotation.z = -Math.PI / 3;
    horn.rotation.y = s * Math.PI / 6;
    g.add(horn);
  });
  // 腿
  const legGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.5, 8);
  [[0.4, 0.25], [0.4, -0.25], [-0.4, 0.22], [-0.4, -0.22]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, darkFur);
    leg.position.set(x, -0.6, z);
    g.add(leg);
  });
  // 尾巴
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.4, 6), darkFur);
  tail.position.set(-0.72, 0.1, 0);
  tail.rotation.z = Math.PI / 3;
  g.add(tail);
  // 草丛底座
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.08, 24), std(0x7a6a3a, { roughness: 1 }));
  base.position.y = -0.9;
  g.add(base);

  g.rotation.y = -Math.PI / 3;
  scene.add(g);
  return scene;
}

// ========== 2. granary 粮仓 ==========
function createGranary() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 圆锥顶粮仓主体
  const silo = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 1.0, 16), std(WOOD));
  silo.position.y = 0.1;
  g.add(silo);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.5, 16), std(BROWN));
  roof.position.y = 0.85;
  g.add(roof);
  // 仓门
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.06), std(DARK));
  door.position.set(0, -0.15, 0.58);
  g.add(door);
  // 底座
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.12, 16), std(0x6a5a4a));
  base.position.y = -0.45;
  g.add(base);
  // 粮囤边的陶罐
  [[-0.85, 0.2], [0.85, 0.25]].forEach(([x, z]) => {
    const jar = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), std(0xa8763e, { roughness: 0.7 }));
    jar.scale.set(1, 1.15, 1);
    jar.position.set(x, -0.2, z);
    g.add(jar);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 12), std(0x8a5f30));
    rim.position.set(x, 0.03, z);
    g.add(rim);
  });
  // 溢出的麦穗（金色小球堆）
  for (let i = 0; i < 8; i++) {
    const grain = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), std(GOLD, { roughness: 0.4, metalness: 0.3 }));
    const a = i / 8 * Math.PI * 2;
    grain.position.set(Math.cos(a) * 0.45, -0.38, Math.sin(a) * 0.45 + 0.3);
    g.add(grain);
  }
  // 守卫的小旗
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6), std(DARK));
  pole.position.set(0, 1.35, 0);
  g.add(pole);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.01), std(RED));
  flag.position.set(0.14, 1.55, 0);
  g.add(flag);

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 3. clay_tablet 楔形文字泥板 ==========
function createClayTablet() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 泥板（圆角长方体，微倾）
  const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.12), std(0xa8763e, { roughness: 0.85 }));
  g.add(tablet);
  // 楔形刻痕（小三角锥，排成几行）
  const wedgeMat = std(0x6a4a28, { roughness: 0.9 });
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if ((row * 5 + col) % 3 === 2) continue; // 留出随机空隙
      const wedge = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.06, 4), wedgeMat);
      wedge.rotation.x = Math.PI / 2;
      wedge.rotation.z = ((row + col) % 4) * Math.PI / 8;
      wedge.position.set(-0.3 + col * 0.15, 0.45 - row * 0.15, 0.07);
      g.add(wedge);
    }
  }
  // 芦苇笔
  const stylus = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.008, 0.9, 8), std(0xc9b06a, { roughness: 0.7 }));
  stylus.position.set(0.65, -0.3, 0.15);
  stylus.rotation.z = Math.PI / 4;
  g.add(stylus);
  // 支架
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.3), std(DARK));
  stand.position.set(0, -0.65, -0.05);
  g.add(stand);

  g.rotation.x = -Math.PI / 14;
  g.rotation.y = Math.PI / 7;
  scene.add(g);
  return scene;
}

// ========== 4. exam_desk 科举考桌 ==========
function createExamDesk() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 考棚小桌
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.55), std(WOOD));
  deskTop.position.y = 0.15;
  g.add(deskTop);
  [[-0.4, 0.22], [0.4, 0.22], [-0.4, -0.22], [0.4, -0.22]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.06), std(BROWN));
    leg.position.set(x, -0.08, z);
    g.add(leg);
  });
  // 考卷（摊开的纸）
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.015, 0.4), std(PAPER, { roughness: 0.9 }));
  paper.position.set(-0.05, 0.19, 0);
  g.add(paper);
  // 卷面上的字行
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.004, 0.02), std(DARK));
    line.position.set(-0.05, 0.2, -0.14 + i * 0.07);
    g.add(line);
  }
  // 毛笔
  const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), std(BROWN));
  brush.position.set(0.3, 0.24, 0.1);
  brush.rotation.z = Math.PI / 2.5;
  g.add(brush);
  const brushTip = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.08, 8), std(DARK));
  brushTip.position.set(0.42, 0.19, 0.1);
  brushTip.rotation.z = Math.PI / 2.5 + Math.PI;
  g.add(brushTip);
  // 砚台
  const inkstone = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.05, 12), std(0x3a3a3a, { roughness: 0.4 }));
  inkstone.position.set(0.32, 0.2, -0.15);
  g.add(inkstone);
  // 蜡烛（寒窗）
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.18, 10), std(CREAM));
  candle.position.set(-0.35, 0.27, -0.15);
  g.add(candle);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 8),
    std(GOLD, { emissive: 0xffaa33, emissiveIntensity: 0.9 }));
  flame.position.set(-0.35, 0.42, -0.15);
  g.add(flame);
  // 一盏小灯笼氛围（青色点缀）
  const lampGlow = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8),
    std(TEAL, { emissive: TEAL, emissiveIntensity: 0.5 }));
  lampGlow.position.set(0.42, 0.3, 0.2);
  g.add(lampGlow);

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 5. ration_coupon 粮票 ==========
function createRationCoupon() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 主粮票
  const coupon = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.015), std(0xd8c8a0, { roughness: 0.8 }));
  g.add(coupon);
  // 红色边框
  const borderTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.018), std(RED));
  borderTop.position.set(0, 0.21, 0);
  g.add(borderTop);
  const borderBot = borderTop.clone();
  borderBot.position.y = -0.21;
  g.add(borderBot);
  // 齿轮花边（左右）
  for (let i = 0; i < 6; i++) {
    const dotL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8), std(RED));
    dotL.rotation.x = Math.PI / 2;
    dotL.position.set(-0.46, -0.18 + i * 0.075, 0);
    g.add(dotL);
    const dotR = dotL.clone();
    dotR.position.x = 0.46;
    g.add(dotR);
  }
  // 中央印章圆
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), std(RED, { roughness: 0.5 }));
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0.28, 0, 0.01);
  g.add(seal);
  // 面额数字块（"伍斤"抽象成金条）
  const denom = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.02), std(GOLD, { metalness: 0.5, roughness: 0.3 }));
  denom.position.set(-0.2, 0, 0.01);
  g.add(denom);
  // 后面叠两张不同颜色的票
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.012), std(0xb8c8a8, { roughness: 0.8 }));
  c2.position.set(0.08, -0.06, -0.04);
  c2.rotation.z = 0.08;
  g.add(c2);
  const c3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.012), std(0xa8b8c8, { roughness: 0.8 }));
  c3.position.set(-0.06, -0.1, -0.08);
  c3.rotation.z = -0.06;
  g.add(c3);

  g.rotation.x = -Math.PI / 10;
  g.rotation.y = Math.PI / 8;
  scene.add(g);
  return scene;
}

// ========== 6. admission_ticket 准考证 ==========
function createAdmissionTicket() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 准考证本体（竖版卡片）
  const card = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.02), std(PAPER, { roughness: 0.85 }));
  g.add(card);
  // 顶部红条
  const header = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.025), std(RED));
  header.position.set(0, 0.4, 0);
  g.add(header);
  // 照片框
  const photo = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.025), std(0x9ab8c8, { roughness: 0.6 }));
  photo.position.set(-0.17, 0.12, 0.01);
  g.add(photo);
  // 照片里的人影
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), std(0xd4a574));
  head.position.set(-0.17, 0.16, 0.03);
  g.add(head);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), std(0x5a6a7a));
  shoulders.scale.set(1.2, 0.6, 0.5);
  shoulders.position.set(-0.17, 0.05, 0.03);
  g.add(shoulders);
  // 文字行
  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.026), std(DARK));
    line.position.set(0.13, 0.2 - i * 0.09, 0.01);
    g.add(line);
  }
  // 大红印章
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 6), std(RED, { roughness: 0.5 }));
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0.1, -0.25, 0.02);
  g.add(seal);
  // 底部编号条
  const serial = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.025), std(GOLD, { metalness: 0.4, roughness: 0.4 }));
  serial.position.set(0, -0.4, 0.01);
  g.add(serial);
  // 背后一本翻旧的书
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.06), std(0x7a5a8a, { roughness: 0.8 }));
  book.position.set(0.15, -0.1, -0.08);
  book.rotation.z = 0.15;
  g.add(book);

  g.rotation.y = Math.PI / 7;
  g.rotation.x = -Math.PI / 14;
  scene.add(g);
  return scene;
}

// ========== 7. single_track 单轨 ==========
function createSingleTrack() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 大地
  const ground = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), std(0x8a7a5a, { roughness: 1 }));
  ground.position.y = -0.1;
  g.add(ground);
  // 唯一一条铁轨（延伸到远方，逐渐收窄的视觉用两段）
  const railMat = std(0x888888, { metalness: 0.8, roughness: 0.3 });
  [-0.12, 0.12].forEach(z => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.04), railMat);
    rail.position.set(0, 0, z);
    g.add(rail);
  });
  // 枕木
  for (let i = 0; i < 10; i++) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.45), std(BROWN));
    tie.position.set(-1.1 + i * 0.24, -0.03, 0);
    g.add(tie);
  }
  // 轨道上排队行走的小人（同方向、等距）
  for (let i = 0; i < 4; i++) {
    const person = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.22, 8), std(0x5a6a8a));
    body.position.y = 0.16;
    person.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), std(0xd4a574));
    head.position.y = 0.32;
    person.add(head);
    person.position.set(-0.9 + i * 0.55, 0.02, 0);
    g.add(person);
  }
  // 轨道尽头的小旗（唯一方向）
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), std(DARK));
  pole.position.set(1.15, 0.25, 0);
  g.add(pole);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.01), std(GOLD, { metalness: 0.4, roughness: 0.4 }));
  flag.position.set(1.27, 0.43, 0);
  g.add(flag);
  // 两侧空旷的警戒桩（暗示"没有别的路"）
  [[-0.6, 0.7], [0.2, -0.7], [0.8, 0.7]].forEach(([x, z]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), std(RED));
    post.position.set(x, 0.02, z);
    g.add(post);
  });

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 8. lottery_wheel 彩票转盘 ==========
function createLotteryWheel() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 转盘
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 24), std(WOOD));
  wheel.position.y = 0.3;
  g.add(wheel);
  // 分区扇叶
  const segColors = [RED, GOLD, TEAL, 0x5a6a8a, 0x8a5a7a, 0x6a8a5a];
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), std(segColors[i], { roughness: 0.4 }));
    seg.position.set(Math.cos(a) * 0.55, 0.3, Math.sin(a) * 0.55);
    seg.rotation.y = -a;
    g.add(seg);
  }
  // 轮缘灯泡
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8),
      std(GOLD, { emissive: 0xffcc55, emissiveIntensity: 0.7 }));
    bulb.position.set(Math.cos(a) * 0.75, 0.34, Math.sin(a) * 0.75);
    g.add(bulb);
  }
  // 中心轴
  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), std(GOLD, { metalness: 0.7, roughness: 0.3 }));
  hub.position.y = 0.34;
  g.add(hub);
  // 指针
  const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 8), std(RED, { roughness: 0.4 }));
  pointer.position.set(0, 0.5, 0.82);
  pointer.rotation.x = Math.PI;
  g.add(pointer);
  // 支架
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), std(DARK));
  stand.position.set(0, -0.1, 0);
  g.add(stand);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.08, 16), std(DARK));
  base.position.y = -0.48;
  g.add(base);
  // 星星点缀（"美国梦"闪光）
  for (let i = 0; i < 5; i++) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.04),
      std(GOLD, { emissive: GOLD, emissiveIntensity: 0.4 }));
    star.position.set((Math.sin(i * 2.4)) * 0.9, 0.9 + i * 0.08, Math.cos(i * 2.4) * 0.5);
    g.add(star);
  }

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 9. empty_shelf 空货架 ==========
function createEmptyShelf() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 货架立柱与层板
  const frameMat = std(0x7a7a7a, { metalness: 0.6, roughness: 0.4 });
  [[-0.7, 0.3], [0.7, 0.3], [-0.7, -0.3], [0.7, -0.3]].forEach(([x, z]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 0.06), frameMat);
    post.position.set(x, 0, z);
    g.add(post);
  });
  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.7), std(0x9a9a9a, { metalness: 0.5, roughness: 0.5 }));
    shelf.position.set(0, -0.7 + i * 0.65, 0);
    g.add(shelf);
  }
  // 唯一剩下的一小盒商品（对比"空"）
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.12), std(0xa8b8c8, { roughness: 0.7 }));
  box.position.set(-0.5, 0.19, 0.15);
  g.add(box);
  // 翻倒的空纸箱
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.25), std(0xb09a7a, { roughness: 0.9 }));
  crate.position.set(0.5, -0.92, 0.35);
  crate.rotation.z = Math.PI / 5;
  g.add(crate);
  // 价格牌（空的）
  const tag = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.01), std(PAPER));
  tag.position.set(0, 0.02, 0.36);
  g.add(tag);
  // 排队的人群剪影（三个小圆柱，灰色）
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 8), std(0x6a6a72, { roughness: 0.9 }));
    p.position.set(-0.3 + i * 0.25, -0.85, 0.75);
    g.add(p);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), std(0x8a8a92));
    h.position.set(-0.3 + i * 0.25, -0.65, 0.75);
    g.add(h);
  }
  // 褪色的红星
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), std(0x8a4a42, { roughness: 0.7 }));
  star.position.set(0, 0.95, 0);
  g.add(star);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 10. coin_tower 硬币塔 ==========
function createCoinTower() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  const coinMat = std(GOLD, { metalness: 0.8, roughness: 0.25 });
  // 硬币塔（越往上越细，微倾斜 = 杠杆的危险感）
  const layers = [0.55, 0.5, 0.45, 0.4, 0.34, 0.28, 0.22];
  let y = -0.7;
  layers.forEach((r, i) => {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.09, 24), coinMat);
    coin.position.set(i * 0.03, y, 0);
    g.add(coin);
    y += 0.1;
  });
  // 塔顶一张合同纸
  const contract = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.015), std(PAPER, { roughness: 0.85 }));
  contract.position.set(0.22, y + 0.15, 0);
  contract.rotation.z = -0.2;
  g.add(contract);
  const sealDot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12), std(RED));
  sealDot.rotation.x = Math.PI / 2;
  sealDot.position.set(0.28, y + 0.05, 0.02);
  g.add(sealDot);
  // 债务漩涡（环绕的纸带）
  const swirlMat = std(0xd8cba8, { roughness: 0.8, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    const r = 0.75 - i * 0.03;
    const slip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.008), swirlMat);
    slip.position.set(Math.cos(a) * r, -0.5 + i * 0.12, Math.sin(a) * r);
    slip.rotation.y = -a + Math.PI / 2;
    slip.rotation.z = 0.3;
    g.add(slip);
  }
  // 塔底被吸上去的小房子
  const house = new THREE.Group();
  const hb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.15), std(0x9a8a7a));
  house.add(hb);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.1, 4), std(RED));
  roof.position.y = 0.12;
  roof.rotation.y = Math.PI / 4;
  house.add(roof);
  house.position.set(-0.85, -0.55, 0.3);
  house.rotation.z = 0.4;
  g.add(house);
  // 底座阴影盘
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.06, 24), std(DARK));
  base.position.y = -0.78;
  g.add(base);

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 11. office_badge 工牌 ==========
function createOfficeBadge() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 挂绳
  const lanyardMat = std(TEAL, { roughness: 0.6 });
  const lanyardL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), lanyardMat);
  lanyardL.position.set(-0.12, 0.65, 0);
  lanyardL.rotation.z = Math.PI / 8;
  g.add(lanyardL);
  const lanyardR = lanyardL.clone();
  lanyardR.position.x = 0.12;
  lanyardR.rotation.z = -Math.PI / 8;
  g.add(lanyardR);
  // 卡套
  const holder = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.04), std(0xdde8ee, { roughness: 0.3, transparent: true, opacity: 0.7 }));
  holder.position.y = 0;
  g.add(holder);
  // 卡片
  const card = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.68, 0.02), std(PAPER, { roughness: 0.7 }));
  card.position.z = 0.01;
  g.add(card);
  // 公司色条
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 0.025), std(TEAL));
  stripe.position.set(0, 0.28, 0.015);
  g.add(stripe);
  // 照片
  const photo = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.025), std(0x9ab8c8));
  photo.position.set(-0.12, 0.06, 0.015);
  g.add(photo);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), std(0xd4a574));
  head.position.set(-0.12, 0.09, 0.03);
  g.add(head);
  // 名字行
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.026), std(DARK));
    line.position.set(0.1, 0.12 - i * 0.06, 0.015);
    g.add(line);
  }
  // "正式"金徽章 vs "派遣"灰徽章（新种姓对比）
  const badgeGold = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.025, 6),
    std(GOLD, { metalness: 0.7, roughness: 0.3, emissive: GOLD, emissiveIntensity: 0.15 }));
  badgeGold.rotation.x = Math.PI / 2;
  badgeGold.position.set(0.12, -0.14, 0.02);
  g.add(badgeGold);
  const badgeGrey = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 6), std(0x8a8a8a, { roughness: 0.7 }));
  badgeGrey.rotation.x = Math.PI / 2;
  badgeGrey.position.set(-0.02, -0.14, 0.015);
  g.add(badgeGrey);
  // 玻璃隔墙（中间一道）
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.15),
    std(0xaaddee, { transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.5 }));
  wall.position.set(0.05, -0.14, 0.05);
  g.add(wall);
  // 夹子
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.05), std(0x888888, { metalness: 0.8, roughness: 0.3 }));
  clip.position.y = 0.4;
  g.add(clip);

  g.rotation.y = Math.PI / 7;
  scene.add(g);
  return scene;
}

// ========== 12. data_castle 数据城堡 ==========
function createDataCastle() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 城堡 = 巨型手机
  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 0.1), std(DARK, { metalness: 0.6, roughness: 0.3 }));
  phoneBody.position.y = 0.35;
  g.add(phoneBody);
  // 屏幕（发光的青）
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.1, 0.03),
    std(0x1a3a4a, { emissive: TEAL, emissiveIntensity: 0.35, roughness: 0.2 }));
  screen.position.set(0, 0.35, 0.06);
  g.add(screen);
  // 屏幕上的 app 图标格 + 数据条（更亮，默认角度一眼认出手机）
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const icon = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.04),
        std([GOLD, TEAL, RED, 0x5a6a8a, 0x8a5a7a, 0x6a8a5a, 0xd8cba8, 0x4a7a9a, 0xc98a4c][r * 3 + c],
          { emissive: [GOLD, TEAL, RED, 0x5a6a8a, 0x8a5a7a, 0x6a8a5a, 0xd8cba8, 0x4a7a9a, 0xc98a4c][r * 3 + c], emissiveIntensity: 0.35, roughness: 0.4 }));
      icon.position.set(-0.19 + c * 0.19, 0.72 - r * 0.19, 0.07);
      g.add(icon);
    }
  }
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.04),
      std(GOLD, { emissive: GOLD, emissiveIntensity: 0.5 }));
    bar.position.set(0, 0.12 - i * 0.14, 0.07);
    g.add(bar);
  }
  // 城垛（顶部齿）
  for (let i = 0; i < 4; i++) {
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.1), std(DARK, { metalness: 0.6, roughness: 0.3 }));
    merlon.position.set(-0.3 + i * 0.2, 1.06, 0);
    g.add(merlon);
  }
  // 电缆根须（扎入地球）
  const cableMat = std(0x3a3a3a, { roughness: 0.7 });
  [[-0.3, 0.3], [0.3, 0.3], [0, -0.35], [-0.2, -0.3], [0.25, -0.25]].forEach(([x, z]) => {
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.6, 6), cableMat);
    cable.position.set(x, -0.55, z);
    cable.rotation.x = z * 0.5;
    cable.rotation.z = -x * 0.5;
    g.add(cable);
  });
  // 地球底座
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), std(0x2a5a6a, { roughness: 0.5 }));
  globe.scale.set(1, 0.45, 1);
  globe.position.y = -1.0;
  g.add(globe);
  // 向上汇入的光流（数据税/注意力税）
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6),
      std(GOLD, { emissive: GOLD, emissiveIntensity: 0.6 }));
    stream.position.set(Math.cos(a) * 0.6, -0.35, Math.sin(a) * 0.6);
    stream.rotation.z = Math.cos(a) * 0.4;
    stream.rotation.x = -Math.sin(a) * 0.4;
    g.add(stream);
  }
  // 小人和小店
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + 0.5;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.18, 8), std(0x7a6a8a));
    p.position.set(Math.cos(a) * 0.55, -0.72, Math.sin(a) * 0.55);
    g.add(p);
  }

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 13. wheat_farmer 麦田农民 ==========
function createWheatFarmer() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 麦田地
  const field = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.15, 0.08, 24), std(0xb89a4a, { roughness: 1 }));
  field.position.y = -0.85;
  g.add(field);
  // 麦穗丛
  const wheatMat = std(GOLD, { roughness: 0.7 });
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    const r = 0.55 + (i % 3) * 0.18;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.4, 4), std(0x8a7a3a));
    stalk.position.set(Math.cos(a) * r, -0.6, Math.sin(a) * r);
    g.add(stalk);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), wheatMat);
    ear.position.set(Math.cos(a) * r, -0.35, Math.sin(a) * r);
    g.add(ear);
  }
  // 弯腰的农民（剪影式）
  const farmerMat = std(0x5a4a3a, { roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 8), farmerMat);
  body.position.set(0, -0.5, 0);
  body.rotation.z = Math.PI / 5; // 弯腰
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), std(0xc49a6c));
  head.position.set(0.22, -0.32, 0);
  g.add(head);
  // 草帽
  const hat = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.08, 12), std(0xd8b86a, { roughness: 0.9 }));
  hat.position.set(0.24, -0.24, 0);
  g.add(hat);
  // 镰刀
  const sickleHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 6), std(WOOD));
  sickleHandle.position.set(0.3, -0.55, 0.15);
  sickleHandle.rotation.z = Math.PI / 3;
  g.add(sickleHandle);
  const blade = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 6, 12, Math.PI),
    std(0xaaaaaa, { metalness: 0.8, roughness: 0.3 }));
  blade.position.set(0.4, -0.45, 0.15);
  blade.rotation.z = -Math.PI / 3;
  g.add(blade);
  // 远处他养活却进不去的城（剪影）
  const cityMat = std(0x6a6a7a, { roughness: 0.8 });
  [[-0.7, 0.28, -0.7], [-0.45, 0.4, -0.75], [-0.9, 0.2, -0.55]].forEach(([x, h, z]) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.12), cityMat);
    tower.position.set(x, -0.81 + h / 2, z);
    g.add(tower);
  });
  // 小庙尖顶
  const temple = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.15, 4), std(GOLD, { metalness: 0.5, roughness: 0.4 }));
  temple.position.set(-0.45, -0.3, -0.75);
  temple.rotation.y = Math.PI / 4;
  g.add(temple);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 14. noble_feast 贵族宴席 ==========
function createNobleFeast() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 长桌
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.07, 0.7), std(0x6a3a2a, { roughness: 0.5 }));
  table.position.y = -0.1;
  g.add(table);
  [[-0.7, 0.25], [0.7, 0.25], [-0.7, -0.25], [0.7, -0.25]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.5, 8), std(0x5a2e20));
    leg.position.set(x, -0.38, z);
    g.add(leg);
  });
  // 桌布
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.02, 0.75), std(0xf0e8d8, { roughness: 0.9 }));
  cloth.position.y = -0.06;
  g.add(cloth);
  // 烤鸡/面包/水果
  const roast = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), std(0xa86a3a, { roughness: 0.7 }));
  roast.scale.set(1.3, 0.8, 0.9);
  roast.position.set(0, 0.02, 0);
  g.add(roast);
  const bread = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), std(0xd8a86a, { roughness: 0.8 }));
  bread.scale.set(1.4, 0.7, 0.8);
  bread.position.set(-0.4, 0.0, 0.15);
  g.add(bread);
  for (let i = 0; i < 3; i++) {
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), std([RED, 0x8a5a8a, 0x6a8a3a][i]));
    fruit.position.set(0.4 + i * 0.1, -0.0, 0.15 - i * 0.08);
    g.add(fruit);
  }
  // 高脚杯
  [-0.25, 0.25].forEach(x => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.1, 10),
      std(GOLD, { metalness: 0.85, roughness: 0.2 }));
    cup.position.set(x, 0.08, -0.2);
    g.add(cup);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6),
      std(GOLD, { metalness: 0.85, roughness: 0.2 }));
    stem.position.set(x, 0.0, -0.2);
    g.add(stem);
  });
  // 蜡烛台（奢华）
  const candleStick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.25, 8),
    std(GOLD, { metalness: 0.85, roughness: 0.2 }));
  candleStick.position.set(0.55, 0.1, 0);
  g.add(candleStick);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.06, 8),
    std(GOLD, { emissive: 0xffaa33, emissiveIntensity: 1 }));
  flame.position.set(0.55, 0.28, 0);
  g.add(flame);
  // 丝绸椅背（贵族）
  const chair = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.05), std(0x7a2a3a, { roughness: 0.6 }));
  chair.position.set(0, 0.1, 0.5);
  g.add(chair);
  // 桌子另一头：农民交出的一袋粮（对比）
  const sack = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), std(0x9a8a6a, { roughness: 1 }));
  sack.scale.set(0.9, 1.1, 0.9);
  sack.position.set(-0.65, -0.5, 0.5);
  g.add(sack);
  const sackTie = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.06, 8), std(0x7a6a4a));
  sackTie.position.set(-0.65, -0.38, 0.5);
  g.add(sackTie);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 15. hard_hat 安全帽 ==========
function createHardHat() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 安全帽
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    std(0xe8c83a, { roughness: 0.35, metalness: 0.1 }));
  g.add(dome);
  // 帽檐
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 20), std(0xe8c83a, { roughness: 0.35 }));
  brim.position.y = 0.0;
  g.add(brim);
  // 顶部加强筋
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.6), std(0xd8b828, { roughness: 0.4 }));
  ridge.position.y = 0.38;
  g.add(ridge);
  // 帽带
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 8, 20, Math.PI), std(DARK));
  strap.rotation.x = Math.PI / 2;
  strap.rotation.z = Math.PI;
  strap.position.y = -0.05;
  g.add(strap);
  // 编织袋（农民工进城）
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.2), std(0x4a6a9a, { roughness: 0.9 }));
  bag.position.set(0.6, -0.3, 0.1);
  bag.rotation.z = 0.1;
  g.add(bag);
  // 编织袋条纹
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.21), std(0xd8d8d8, { roughness: 0.9 }));
    stripe.position.set(0.6, -0.38 + i * 0.09, 0.1);
    stripe.rotation.z = 0.1;
    g.add(stripe);
  }
  // 背景：他们建起的高楼剪影 + 脚手架
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.3), std(0x5a6a7a, { roughness: 0.6 }));
  tower.position.set(-0.65, 0.15, -0.3);
  g.add(tower);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02),
        std(GOLD, { emissive: GOLD, emissiveIntensity: 0.25 }));
      win.position.set(-0.73 + j * 0.16, -0.2 + i * 0.22, -0.14);
      g.add(win);
    }
  }
  // 脚手架杆
  const scaffoldMat = std(0x8a8a8a, { metalness: 0.7, roughness: 0.4 });
  const sv = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 6), scaffoldMat);
  sv.position.set(-0.42, 0.1, -0.3);
  g.add(sv);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), scaffoldMat);
  sh.rotation.z = Math.PI / 2;
  sh.position.set(-0.55, 0.45, -0.3);
  g.add(sh);
  // 地台
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.06, 24), std(0x7a7060, { roughness: 1 }));
  base.position.y = -0.48;
  g.add(base);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 16. money_growth 钱生钱 ==========
function createMoneyGrowth() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 扶手椅（睡觉的巴菲特）
  const chairMat = std(0x6a3a3a, { roughness: 0.7 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.45), chairMat);
  seat.position.y = -0.35;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.12), chairMat);
  back.position.set(0, -0.08, -0.2);
  g.add(back);
  [[-0.22, 0.18], [0.22, 0.18]].forEach(([x, z]) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), chairMat);
    arm.position.set(x, -0.2, z - 0.05);
    g.add(arm);
  });
  // 睡着的人
  const bodyM = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), std(0x4a5a7a, { roughness: 0.8 }));
  bodyM.scale.set(1, 1.2, 0.9);
  bodyM.position.set(0, -0.18, 0);
  g.add(bodyM);
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), std(0xd4a574));
  headM.position.set(0.08, 0.02, 0.05);
  headM.rotation.z = -0.4;
  g.add(headM);
  // Zzz
  for (let i = 0; i < 3; i++) {
    const z = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.015), std(0xaab8c8, { transparent: true, opacity: 0.8 - i * 0.2 }));
    z.position.set(0.2 + i * 0.08, 0.12 + i * 0.07, 0.05);
    z.rotation.z = 0.5;
    g.add(z);
  }
  // 自动生长的金币堆（三摞，一摞比一摞高 + 发芽）
  const coinMat = std(GOLD, { metalness: 0.8, roughness: 0.25 });
  [[0.55, 3], [0.75, 5], [0.95, 8]].forEach(([x, n], si) => {
    for (let i = 0; i < n; i++) {
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 16), coinMat);
      coin.position.set(x, -0.45 + i * 0.035, 0.1 - si * 0.1);
      g.add(coin);
    }
    // 堆顶新长出的金币"芽"
    const sprout = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12),
      std(GOLD, { metalness: 0.8, roughness: 0.2, emissive: GOLD, emissiveIntensity: 0.3 }));
    sprout.position.set(x + 0.05, -0.45 + n * 0.035 + 0.04, 0.1 - si * 0.1);
    sprout.rotation.z = 0.5;
    g.add(sprout);
  });
  // 上升箭头（r>g）
  const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
    std(TEAL, { emissive: TEAL, emissiveIntensity: 0.4 }));
  arrowShaft.position.set(0.75, 0.25, 0);
  arrowShaft.rotation.z = -Math.PI / 6;
  g.add(arrowShaft);
  const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8),
    std(TEAL, { emissive: TEAL, emissiveIntensity: 0.4 }));
  arrowHead.position.set(0.9, 0.5, 0);
  arrowHead.rotation.z = -Math.PI / 6;
  g.add(arrowHead);
  // 台灯（秘书熬夜）
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), std(DARK));
  lampPole.position.set(-0.6, -0.25, 0.1);
  g.add(lampPole);
  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.1, 10), std(GOLD, { metalness: 0.5, roughness: 0.4 }));
  lampShade.position.set(-0.6, -0.02, 0.1);
  g.add(lampShade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8),
    std(0xffeeaa, { emissive: 0xffdd66, emissiveIntensity: 0.9 }));
  bulb.position.set(-0.6, -0.06, 0.1);
  g.add(bulb);
  // 地台
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.06, 24), std(0x6a5a48, { roughness: 1 }));
  base.position.y = -0.5;
  g.add(base);

  g.rotation.y = Math.PI / 5;
  scene.add(g);
  return scene;
}

// ========== 17. tablet_spiral 平板与历史螺旋 ==========
function createTabletSpiral() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 发光平板
  const tabletBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.04), std(DARK, { metalness: 0.6, roughness: 0.3 }));
  tabletBody.rotation.x = -Math.PI / 3;
  tabletBody.position.y = -0.4;
  g.add(tabletBody);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.045),
    std(0x1a3a4a, { emissive: TEAL, emissiveIntensity: 0.5, roughness: 0.2 }));
  screen.rotation.x = -Math.PI / 3;
  screen.position.y = -0.4;
  g.add(screen);
  // 历史螺旋（从屏幕升起的光带 + 符号物）
  const spiralPts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = t * Math.PI * 4;
    const r = 0.45 * (1 - t * 0.5);
    spiralPts.push(new THREE.Vector3(Math.cos(a) * r, -0.3 + t * 1.1, Math.sin(a) * r));
  }
  const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
  const spiral = new THREE.Mesh(new THREE.TubeGeometry(spiralCurve, 60, 0.015, 6, false),
    std(GOLD, { emissive: GOLD, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.3 }));
  g.add(spiral);
  // 螺旋上的历史符号：野牛(棕块)、麦穗(金锥)、泥板(陶片)、考卷(白纸)、准考证(红条)、硬币塔(金柱)、麦穗、星星
  const markers = [
    { t: 0.08, mesh: () => new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), std(0x6b4a2f, { roughness: 0.9 })) }, // 野牛
    { t: 0.22, mesh: () => new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), std(GOLD, { roughness: 0.6 })) }, // 麦穗
    { t: 0.36, mesh: () => new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.03), std(0xa8763e, { roughness: 0.85 })) }, // 泥板
    { t: 0.5, mesh: () => new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.01), std(PAPER, { roughness: 0.85 })) }, // 考卷
    { t: 0.62, mesh: () => new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.02), std(RED, { roughness: 0.6 })) }, // 准考证
    { t: 0.76, mesh: () => new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 10), std(GOLD, { metalness: 0.8, roughness: 0.25 })) }, // 硬币塔
    { t: 0.88, mesh: () => new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), std(GOLD, { roughness: 0.6 })) }, // 麦穗
    { t: 0.97, mesh: () => new THREE.Mesh(new THREE.OctahedronGeometry(0.06), std(0xffffff, { emissive: 0xffffcc, emissiveIntensity: 0.9 })) }, // 星星
  ];
  markers.forEach(({ t, mesh }) => {
    const m = mesh();
    const p = spiralCurve.getPoint(t);
    m.position.copy(p);
    m.rotation.y = t * Math.PI * 4;
    g.add(m);
  });

  g.rotation.y = Math.PI / 6;
  scene.add(g);
  return scene;
}

// ========== 18. book 故事书（封面） ==========
function createBook() {
  const scene = new THREE.Scene();
  const g = new THREE.Group();

  // 封面（下）
  const coverBot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 1.1), std(0x5a3a5e, { roughness: 0.5 }));
  coverBot.position.set(-0.42, 0, 0);
  coverBot.rotation.z = 0.12;
  g.add(coverBot);
  const coverTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 1.1), std(0x5a3a5e, { roughness: 0.5 }));
  coverTop.position.set(0.42, 0, 0);
  coverTop.rotation.z = -0.12;
  g.add(coverTop);
  // 书页
  const pagesL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1.05), std(PAPER, { roughness: 0.9 }));
  pagesL.position.set(-0.4, 0.07, 0);
  pagesL.rotation.z = 0.1;
  g.add(pagesL);
  const pagesR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1.05), std(PAPER, { roughness: 0.9 }));
  pagesR.position.set(0.4, 0.07, 0);
  pagesR.rotation.z = -0.1;
  g.add(pagesR);
  // 书脊
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8, 1, false, 0, Math.PI), std(0x4a2e4e, { roughness: 0.5 }));
  spine.rotation.x = Math.PI / 2;
  spine.rotation.y = Math.PI / 2;
  spine.position.set(0, 0, 0);
  g.add(spine);
  // 页面上的字行
  for (let i = 0; i < 6; i++) {
    const lineL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.01, 0.03), std(0x8a8a8a));
    lineL.position.set(-0.4, 0.13, -0.4 + i * 0.15);
    lineL.rotation.z = 0.1;
    g.add(lineL);
    const lineR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.01, 0.03), std(0x8a8a8a));
    lineR.position.set(0.4, 0.13, -0.4 + i * 0.15);
    lineR.rotation.z = -0.1;
    g.add(lineR);
  }
  // 书签带
  const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.4), std(RED, { roughness: 0.6 }));
  ribbon.position.set(0.2, 0.1, 0.55);
  ribbon.rotation.z = -0.1;
  g.add(ribbon);
  // 金色螺旋线（呼应封面：历史从书中升起）
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const a = t * Math.PI * 3;
    const r = 0.3 * (1 - t * 0.6);
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0.15 + t * 0.8, Math.sin(a) * r));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const spiral = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.012, 6, false),
    std(GOLD, { emissive: GOLD, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.3 }));
  g.add(spiral);
  // 顶端星星
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.06),
    std(GOLD, { emissive: 0xffee88, emissiveIntensity: 0.9 }));
  star.position.y = 1.0;
  g.add(star);

  g.rotation.y = Math.PI / 6;
  g.rotation.x = -Math.PI / 10;
  scene.add(g);
  return scene;
}

// ========== 主函数 ==========
async function main() {
  console.log('开始生成《阶级的秘密》3D 模型...\n');
  await exportGLB(createBison(), 'bison');
  await exportGLB(createGranary(), 'granary');
  await exportGLB(createClayTablet(), 'clay_tablet');
  await exportGLB(createExamDesk(), 'exam_desk');
  await exportGLB(createRationCoupon(), 'ration_coupon');
  await exportGLB(createAdmissionTicket(), 'admission_ticket');
  await exportGLB(createSingleTrack(), 'single_track');
  await exportGLB(createLotteryWheel(), 'lottery_wheel');
  await exportGLB(createEmptyShelf(), 'empty_shelf');
  await exportGLB(createCoinTower(), 'coin_tower');
  await exportGLB(createOfficeBadge(), 'office_badge');
  await exportGLB(createDataCastle(), 'data_castle');
  await exportGLB(createWheatFarmer(), 'wheat_farmer');
  await exportGLB(createNobleFeast(), 'noble_feast');
  await exportGLB(createHardHat(), 'hard_hat');
  await exportGLB(createMoneyGrowth(), 'money_growth');
  await exportGLB(createTabletSpiral(), 'tablet_spiral');
  await exportGLB(createBook(), 'book');
  console.log('\n全部完成！');
}

main().catch(console.error);

// 《钱是什么》3D 模型生成
// 12 个模型：sheep cowrie gold_coin jiaozi bank_bench gold_bar cut_dollar
//           money_faucet qr_payment credit_card piggy_bank （bitcoin 复用现有）
// 用法：cd /Users/xiamu/Code/wealth-stories && node scripts/gen_money_models.js

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
      } else {
        reject(new Error('Export failed'));
      }
    }, reject, { binary: true });
  });
}

// 调色板
const GOLD = 0xc9a84c, WOOD = 0x8b5a2b, DARK = 0x4a4035, DEEP = 0x2c2418, TEAL = 0x2f6f6f;

// ========== 1. sheep 羊 ==========
function createSheep() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const woolMat = new THREE.MeshStandardMaterial({ color: 0xf0ead8, roughness: 0.9 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x6b5a48, roughness: 0.8 });

  // 身体（毛茸茸 - 几个球叠加）
  const bodyGeo = new THREE.SphereGeometry(0.5, 16, 16);
  bodyGeo.scale(1, 0.85, 1.25);
  const body = new THREE.Mesh(bodyGeo, woolMat);
  group.add(body);
  // 绒球
  for (let i = 0; i < 14; i++) {
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.16 + Math.random() * 0.08, 8, 8), woolMat);
    const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI;
    tuft.position.set(
      Math.sin(b) * Math.cos(a) * 0.45,
      Math.cos(b) * 0.4,
      Math.sin(b) * Math.sin(a) * 0.55
    );
    group.add(tuft);
  }
  // 头
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
  headM.scale.set(1, 1, 1.3);
  headM.position.set(0, 0.18, 0.72);
  group.add(headM);
  // 耳
  const earGeo = new THREE.SphereGeometry(0.09, 8, 8);
  earGeo.scale(1.6, 0.6, 0.6);
  const earL = new THREE.Mesh(earGeo, skinMat); earL.position.set(-0.22, 0.24, 0.68); group.add(earL);
  const earR = new THREE.Mesh(earGeo, skinMat); earR.position.set(0.22, 0.24, 0.68); group.add(earR);
  // 眼
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.1, 0.24, 0.92); group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.1, 0.24, 0.92); group.add(eyeR);
  // 腿
  const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.5, 8);
  [[-0.25, 0.35], [0.25, 0.35], [-0.25, -0.4], [0.25, -0.4]].forEach(p => {
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.position.set(p[0], -0.55, p[1]);
    group.add(leg);
  });
  // 尾
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), woolMat);
  tail.position.set(0, 0.1, -0.7);
  group.add(tail);

  group.position.y = 0.3;
  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 2. cowrie 贝壳 ==========
function createCowrie() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d0, roughness: 0.25, metalness: 0.15 });
  const innerMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.4 });

  // 贝壳主体（椭圆）
  const shellGeo = new THREE.SphereGeometry(0.6, 24, 24);
  shellGeo.scale(1, 0.55, 1.4);
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);
  // 背部条纹
  for (let i = 0; i < 5; i++) {
    const stripeGeo = new THREE.SphereGeometry(0.58, 12, 12);
    stripeGeo.scale(0.15, 0.5, 1.35);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xc9a06a, roughness: 0.4 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-0.4 + i * 0.2, 0.12, 0);
    group.add(stripe);
  }
  // 开口缝（底部黑色长缝）
  const slitGeo = new THREE.SphereGeometry(0.55, 16, 16);
  slitGeo.scale(0.12, 0.2, 1.3);
  const slitMat = new THREE.MeshStandardMaterial({ color: 0x2c2418, roughness: 0.8 });
  const slit = new THREE.Mesh(slitGeo, slitMat);
  slit.position.set(0, -0.22, 0);
  group.add(slit);
  // 齿（开口两侧）
  for (let i = 0; i < 8; i++) {
    const toothGeo = new THREE.ConeGeometry(0.025, 0.08, 4);
    const t1 = new THREE.Mesh(toothGeo, innerMat);
    t1.position.set(0.07, -0.22, -0.5 + i * 0.14);
    t1.rotation.z = -Math.PI / 3;
    group.add(t1);
    const t2 = new THREE.Mesh(toothGeo, innerMat);
    t2.position.set(-0.07, -0.22, -0.5 + i * 0.14);
    t2.rotation.z = Math.PI / 3;
    group.add(t2);
  }

  group.rotation.x = -Math.PI / 8;
  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 3. gold_coin 金币 ==========
function createGoldCoin() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9 });
  const darkGold = new THREE.MeshStandardMaterial({ color: 0xa8862c, roughness: 0.3, metalness: 0.85 });

  // 币体
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.12, 48), goldMat);
  group.add(coin);
  // 边缘齿纹
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.13, 0.06), darkGold);
    tooth.position.set(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9);
    tooth.rotation.y = -a;
    group.add(tooth);
  }
  // 正面狮印（简化：一个圆形章 + 头）
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32), darkGold);
  seal.position.y = 0.07;
  group.add(seal);
  // 狮子头轮廓（球+鬃毛）
  const lionHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), goldMat);
  lionHead.position.set(0, 0.1, 0);
  group.add(lionHead);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const mane = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
    mane.position.set(Math.cos(a) * 0.22, 0.1, Math.sin(a) * 0.22);
    group.add(mane);
  }
  // 外圈文字环
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.03, 8, 48), darkGold);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.07;
  group.add(ring);

  group.rotation.x = Math.PI / 2.3;
  group.rotation.z = Math.PI / 8;
  scene.add(group);
  return scene;
}

// ========== 4. jiaozi 交子（古代纸币卷） ==========
function createJiaozi() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.8 });
  const inkMat = new THREE.MeshStandardMaterial({ color: 0x3a2f22, roughness: 0.7 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xb8423a, roughness: 0.5 });

  // 展开的纸币主体（略弯）
  const noteGeo = new THREE.BoxGeometry(1.4, 0.02, 0.8, 12, 1, 1);
  const pos = noteGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setY(i, pos.getY(i) + Math.sin((x / 1.4) * Math.PI) * 0.08);
  }
  noteGeo.computeVertexNormals();
  const note = new THREE.Mesh(noteGeo, paperMat);
  group.add(note);

  // 边框
  const borderGeo = new THREE.BoxGeometry(1.28, 0.005, 0.68);
  const border = new THREE.Mesh(borderGeo, inkMat);
  border.position.y = 0.03;
  group.add(border);
  const innerGeo = new THREE.BoxGeometry(1.2, 0.005, 0.6);
  const inner = new THREE.Mesh(innerGeo, paperMat);
  inner.position.y = 0.035;
  group.add(inner);

  // 汉字区域（几条墨线代表字）
  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.4), inkMat);
    line.position.set(-0.45 + i * 0.18, 0.05, 0);
    group.add(line);
  }
  // 红色印章
  const seal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.01, 0.16), redMat);
  seal.position.set(0.45, 0.05, 0.15);
  group.add(seal);
  // 铜钱串（旁边一串）
  const coinMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.5, metalness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), coinMat);
    c.position.set(0.9, 0.02 + i * 0.025, -0.3);
    group.add(c);
    // 方孔
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x1a1410 }));
    hole.position.set(0.9, 0.02 + i * 0.025, -0.3);
    group.add(hole);
  }

  group.rotation.y = Math.PI / 7;
  group.rotation.x = -Math.PI / 14;
  scene.add(group);
  return scene;
}

// ========== 5. bank_bench 银行长凳 ==========
function createBankBench() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: WOOD, roughness: 0.7 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.75 });

  // 凳面
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.5), woodMat);
  top.position.y = 0.45;
  group.add(top);
  // 凳腿
  const legGeo = new THREE.BoxGeometry(0.1, 0.45, 0.4);
  [[-0.75, 0], [0.75, 0]].forEach(p => {
    const leg = new THREE.Mesh(legGeo, darkWood);
    leg.position.set(p[0], 0.22, 0);
    group.add(leg);
  });
  // 账房先生（简化人形坐着）
  const clothMat = new THREE.MeshStandardMaterial({ color: 0x4a5a6a, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.45, 8), clothMat);
  body.position.set(-0.3, 0.75, 0);
  group.add(body);
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.6 }));
  headM.position.set(-0.3, 1.05, 0);
  group.add(headM);
  // 账本
  const ledger = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.22), new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.8 }));
  ledger.position.set(0.2, 0.52, 0);
  ledger.rotation.z = -0.1;
  group.add(ledger);
  // 秤
  const scaleArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.8, roughness: 0.3 }));
  scaleArm.position.set(0.6, 0.7, 0);
  group.add(scaleArm);
  const pan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), scaleArm.material);
  pan1.position.set(0.42, 0.6, 0);
  group.add(pan1);
  const pan2 = pan1.clone(); pan2.position.set(0.78, 0.6, 0); group.add(pan2);
  // 钱袋
  const bag = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: 0x9a7a4a, roughness: 0.9 }));
  bag.scale.set(1, 1.2, 1);
  bag.position.set(0.6, 0.55, 0.15);
  group.add(bag);
  // 金币堆
  for (let i = 0; i < 4; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 16), scaleArm.material);
    coin.position.set(0.05, 0.52 + i * 0.018, -0.12);
    group.add(coin);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 6. gold_bar 金条 ==========
function createGoldBar() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.15, metalness: 0.95 });
  const stampMat = new THREE.MeshStandardMaterial({ color: 0xa8862c, roughness: 0.3, metalness: 0.9 });

  function bar() {
    const g = new THREE.Group();
    // 梯形台体（上窄下宽）
    const geo = new THREE.CylinderGeometry(0.32, 0.42, 0.18, 4, 1);
    geo.rotateY(Math.PI / 4);
    geo.scale(1.6, 1, 0.7);
    const m = new THREE.Mesh(geo, goldMat);
    g.add(m);
    // 顶部印记
    const stamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.12), stampMat);
    stamp.position.y = 0.1;
    g.add(stamp);
    return g;
  }
  // 三根金条堆叠（金字塔）
  const b1 = bar(); b1.position.set(-0.35, -0.1, 0); group.add(b1);
  const b2 = bar(); b2.position.set(0.35, -0.1, 0); group.add(b2);
  const b3 = bar(); b3.position.set(0, 0.1, 0); b3.rotation.y = Math.PI / 2; group.add(b3);

  // 后面一张纸币（兑换关系）
  const note = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.01, 0.35), new THREE.MeshStandardMaterial({ color: 0xd8e8d0, roughness: 0.8 }));
  note.position.set(0, 0, -0.5);
  note.rotation.x = -Math.PI / 5;
  group.add(note);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 7. cut_dollar 被剪开的美元与金条 ==========
function createCutDollar() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xd8e8d0, roughness: 0.8 });
  const inkMat = new THREE.MeshStandardMaterial({ color: 0x2a4a2a, roughness: 0.7 });

  // 左半张美元
  const billL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.5), paperMat);
  billL.position.set(-0.45, 0, 0);
  billL.rotation.y = 0.15;
  group.add(billL);
  const markL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), inkMat);
  markL.position.set(-0.45, 0, 0);
  group.add(markL);
  // 右半张美元（漂走）
  const billR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.5), paperMat);
  billR.position.set(0.45, 0.15, 0.1);
  billR.rotation.set(0.2, -0.3, 0.15);
  group.add(billR);
  const markR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), inkMat);
  markR.position.set(0.45, 0.15, 0.1);
  markR.rotation.set(0.2, -0.3, 0.15);
  group.add(markR);

  // 剪刀（中间）
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.9 });
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.02), metalMat);
  blade1.position.set(0, 0.2, 0);
  blade1.rotation.z = 0.3;
  group.add(blade1);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.02), metalMat);
  blade2.position.set(0, 0.2, 0);
  blade2.rotation.z = -0.3;
  group.add(blade2);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xb8423a, roughness: 0.5 });
  const h1 = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), handleMat);
  h1.position.set(-0.12, 0.55, 0);
  group.add(h1);
  const h2 = h1.clone(); h2.position.set(0.12, 0.55, 0); group.add(h2);

  // 下方金条
  const barGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.15, 4, 1);
  barGeo.rotateY(Math.PI / 4);
  barGeo.scale(1.6, 1, 0.7);
  const bar = new THREE.Mesh(barGeo, goldMat);
  bar.position.set(0, -0.5, 0);
  group.add(bar);

  // 分离的虚线火花
  for (let i = 0; i < 6; i++) {
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), goldMat);
    spark.position.set((Math.random() - 0.5) * 0.3, -0.1 + i * 0.08, (Math.random() - 0.5) * 0.2);
    group.add(spark);
  }

  group.rotation.y = Math.PI / 7;
  scene.add(group);
  return scene;
}

// ========== 8. money_faucet 货币水龙头 ==========
function createMoneyFaucet() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.25, metalness: 0.9 });
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9 });
  const tealMat = new THREE.MeshStandardMaterial({ color: TEAL, roughness: 0.5, metalness: 0.3 });

  // 立柱水管
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 16), metalMat);
  pipe.position.set(-0.5, 0.15, 0);
  group.add(pipe);
  // 横管
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 16), metalMat);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(-0.15, 0.68, 0);
  group.add(arm);
  // 出水口
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.18, 16), metalMat);
  spout.position.set(0.2, 0.6, 0);
  group.add(spout);
  // 阀门轮
  const valve = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 24), tealMat);
  valve.rotation.x = Math.PI / 2;
  valve.position.set(-0.5, 0.78, 0);
  group.add(valve);
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.02), tealMat);
    spoke.rotation.y = (i / 4) * Math.PI;
    spoke.position.set(-0.5, 0.78, 0);
    group.add(spoke);
  }
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), metalMat);
  stem.position.set(-0.5, 0.72, 0);
  group.add(stem);

  // 流出的金币（螺旋下落）
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.09 - t * 0.03, 0.09 - t * 0.03, 0.02, 16), goldMat);
    coin.position.set(0.2 + Math.sin(t * 4) * 0.08 * t, 0.5 - t * 0.75, Math.cos(t * 4) * 0.08 * t);
    coin.rotation.set(Math.random() * 0.6, Math.random() * 3, 0);
    group.add(coin);
  }
  // 底部钱币堆
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 0.25;
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), goldMat);
    coin.position.set(0.2 + Math.cos(a) * r, -0.35 + Math.random() * 0.06, Math.sin(a) * r);
    coin.rotation.y = Math.random() * 3;
    group.add(coin);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 9. qr_payment 二维码牌+手机 ==========
function createQRPayment() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.6 });
  const tealMat = new THREE.MeshStandardMaterial({ color: TEAL, roughness: 0.4, metalness: 0.4, emissive: TEAL, emissiveIntensity: 0.15 });
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9, emissive: GOLD, emissiveIntensity: 0.1 });

  // 二维码立牌底座
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.3), darkMat);
  stand.position.set(-0.4, -0.6, 0);
  group.add(stand);
  // 立牌
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.04), whiteMat);
  board.position.set(-0.4, -0.15, 0);
  board.rotation.x = -0.12;
  group.add(board);
  // 二维码图案（伪随机方块）
  const cell = 0.055;
  const pattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,1,1,0,1],
    [1,1,1,0,1,1,0,1,0],
    [0,0,0,1,0,0,1,1,0],
    [1,0,1,1,1,0,0,0,1],
    [0,1,0,0,1,1,1,0,0],
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,1,0,0,1,0,1],
    [1,1,1,0,1,1,0,1,1],
  ];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (pattern[r][c]) {
        const sq = new THREE.Mesh(new THREE.BoxGeometry(cell * 0.92, cell * 0.92, 0.01), darkMat);
        sq.position.set(-0.4 - 4 * cell + c * cell, -0.15 + 4 * cell - r * cell + 0.08, 0.035);
        sq.rotation.x = -0.12;
        group.add(sq);
      }
    }
  }

  // 手机
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.72, 0.04), darkMat);
  phone.position.set(0.45, 0.05, 0.1);
  phone.rotation.set(-0.3, -0.5, 0.1);
  group.add(phone);
  // 屏幕（发光）
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.66, 0.01), new THREE.MeshStandardMaterial({ color: 0x113344, emissive: 0x224a66, emissiveIntensity: 0.7, roughness: 0.2 }));
  screen.position.set(0.45, 0.05, 0.13);
  screen.rotation.set(-0.3, -0.5, 0.1);
  group.add(screen);
  // 屏幕上的扫描框
  const scanFrame = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.008, 4, 4), tealMat);
  scanFrame.position.set(0.42, 0.12, 0.16);
  scanFrame.rotation.set(-0.3, -0.5, 0.1);
  group.add(scanFrame);

  // 从手机飞向二维码的金色光点（支付流）
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025 * (1 - t * 0.4), 8, 8), goldMat);
    dot.position.set(
      0.35 - t * 0.6,
      0.1 - t * 0.15 + Math.sin(t * 3) * 0.05,
      0.12 - t * 0.06
    );
    group.add(dot);
  }

  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// ========== 10. credit_card 信用卡 ==========
function createCreditCard() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const cardMat = new THREE.MeshStandardMaterial({ color: 0x3a5a8a, roughness: 0.25, metalness: 0.6 });
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xb8423a, roughness: 0.4 });

  // 卡体
  const card = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.03), cardMat);
  group.add(card);
  // 芯片
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.02), goldMat);
  chip.position.set(-0.4, 0.1, 0.02);
  group.add(chip);
  // 芯片纹路
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.015, 0.005), cardMat);
    line.position.set(-0.4, 0.05 + i * 0.05, 0.035);
    group.add(line);
  }
  // 卡号条
  for (let i = 0; i < 4; i++) {
    const num = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.005), new THREE.MeshStandardMaterial({ color: 0xd0d8e8, roughness: 0.5 }));
    num.position.set(-0.45 + i * 0.3, -0.1, 0.02);
    group.add(num);
  }
  // 磁条
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 0.01), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 }));
  stripe.position.set(0, 0.28, -0.015);
  group.add(stripe);
  // 标章（双圆）
  const logo1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24), redMat);
  logo1.rotation.x = Math.PI / 2;
  logo1.position.set(0.45, -0.22, 0.02);
  group.add(logo1);
  const logo2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24), new THREE.MeshStandardMaterial({ color: 0xe8a03a, roughness: 0.4, transparent: true, opacity: 0.85 }));
  logo2.rotation.x = Math.PI / 2;
  logo2.position.set(0.56, -0.22, 0.02);
  group.add(logo2);

  // 利息尾巴（后面的阴影锁链/数字）
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const seg = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.7, transparent: true, opacity: 0.7 - t * 0.3 }));
    seg.position.set(0, -0.05 - i * 0.12, -0.15 - i * 0.1);
    seg.rotation.x = i % 2 ? Math.PI / 2 : 0;
    group.add(seg);
  }

  group.rotation.y = Math.PI / 7;
  group.rotation.x = -Math.PI / 12;
  scene.add(group);
  return scene;
}

// ========== 11. piggy_bank 存钱罐 ==========
function createPiggyBank() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  const pigMat = new THREE.MeshStandardMaterial({ color: 0xe8a8b0, roughness: 0.4, metalness: 0.1 });
  const darkPink = new THREE.MeshStandardMaterial({ color: 0xc9788a, roughness: 0.5 });
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.2, metalness: 0.9 });

  // 身体
  const bodyGeo = new THREE.SphereGeometry(0.55, 24, 24);
  bodyGeo.scale(1, 0.85, 1.2);
  const body = new THREE.Mesh(bodyGeo, pigMat);
  group.add(body);
  // 鼻子
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 16), darkPink);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 0.02, 0.68);
  group.add(snout);
  // 鼻孔
  const nostrilGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8);
  const nMat = new THREE.MeshStandardMaterial({ color: 0x8a4a5a });
  const n1 = new THREE.Mesh(nostrilGeo, nMat); n1.rotation.x = Math.PI / 2; n1.position.set(-0.05, 0.02, 0.75); group.add(n1);
  const n2 = new THREE.Mesh(nostrilGeo, nMat); n2.rotation.x = Math.PI / 2; n2.position.set(0.05, 0.02, 0.75); group.add(n2);
  // 眼
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const e1 = new THREE.Mesh(eyeGeo, eyeMat); e1.position.set(-0.18, 0.22, 0.55); group.add(e1);
  const e2 = new THREE.Mesh(eyeGeo, eyeMat); e2.position.set(0.18, 0.22, 0.55); group.add(e2);
  // 耳
  const earGeo = new THREE.ConeGeometry(0.1, 0.18, 4);
  const ear1 = new THREE.Mesh(earGeo, darkPink); ear1.position.set(-0.28, 0.45, 0.3); ear1.rotation.z = 0.3; group.add(ear1);
  const ear2 = new THREE.Mesh(earGeo, darkPink); ear2.position.set(0.28, 0.45, 0.3); ear2.rotation.z = -0.3; group.add(ear2);
  // 腿
  const legGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.18, 8);
  [[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.35], [0.3, -0.35]].forEach(p => {
    const leg = new THREE.Mesh(legGeo, darkPink);
    leg.position.set(p[0], -0.5, p[1]);
    group.add(leg);
  });
  // 尾巴（卷）
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 16, Math.PI * 1.5), darkPink);
  tail.position.set(0, 0.1, -0.68);
  tail.rotation.y = Math.PI / 2;
  group.add(tail);
  // 投币口
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.04), new THREE.MeshStandardMaterial({ color: 0x8a4a5a }));
  slot.position.set(0, 0.47, 0.05);
  group.add(slot);
  // 正投入的金币
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 24), goldMat);
  coin.rotation.x = Math.PI / 2;
  coin.position.set(0, 0.58, 0.05);
  group.add(coin);
  // 旁边几枚金币
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), goldMat);
    c.position.set(-0.75 + i * 0.12, -0.55 + i * 0.025, 0.3);
    group.add(c);
  }

  group.position.y = 0.1;
  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 主函数 ==========
async function main() {
  console.log('开始生成《钱是什么》3D 模型...\n');
  // bitcoin.glb 已存在，直接复用，不重造
  await exportGLB(createSheep(), 'sheep');
  await exportGLB(createCowrie(), 'cowrie');
  await exportGLB(createGoldCoin(), 'gold_coin');
  await exportGLB(createJiaozi(), 'jiaozi');
  await exportGLB(createBankBench(), 'bank_bench');
  await exportGLB(createGoldBar(), 'gold_bar');
  await exportGLB(createCutDollar(), 'cut_dollar');
  await exportGLB(createMoneyFaucet(), 'money_faucet');
  await exportGLB(createQRPayment(), 'qr_payment');
  await exportGLB(createCreditCard(), 'credit_card');
  await exportGLB(createPiggyBank(), 'piggy_bank');
  console.log('\n全部完成！（bitcoin 复用现有 bitcoin.glb）');
}

main().catch(console.error);

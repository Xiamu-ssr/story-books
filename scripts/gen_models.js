// 生成所有 3D 模型 - 精细版
// 用 Three.js 程序化建模，导出 GLB

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

// 通用导出函数
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

// ========== 1. 遥控器（精细版） ==========
function createRemote() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 主体 - 圆角长方体，更真实的弧度
  const bodyGeo = new THREE.BoxGeometry(0.75, 2.2, 0.28, 8, 16, 4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.35,
    metalness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 顶部红外窗口 - 更精致
  const irGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32);
  const irMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a1a,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x220000,
    emissiveIntensity: 0.5
  });
  const ir = new THREE.Mesh(irGeo, irMat);
  ir.rotation.x = Math.PI / 2;
  ir.position.set(0, 1.15, 0);
  group.add(ir);

  // 品牌标志
  const logoGeo = new THREE.BoxGeometry(0.35, 0.12, 0.02);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.15
  });
  const logo = new THREE.Mesh(logoGeo, logoMat);
  logo.position.set(0, 0.95, 0.15);
  group.add(logo);

  // 电源按钮 - 红色，更突出
  const powerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24);
  const powerMat = new THREE.MeshStandardMaterial({
    color: 0xcc2222,
    roughness: 0.2,
    metalness: 0.4,
    emissive: 0x440000,
    emissiveIntensity: 0.2
  });
  const power = new THREE.Mesh(powerGeo, powerMat);
  power.rotation.x = Math.PI / 2;
  power.position.set(0, 0.7, 0.17);
  group.add(power);

  // 导航圆盘 - 环形
  const navRingGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
  const navRingMat = new THREE.MeshStandardMaterial({
    color: 0x3d3225,
    roughness: 0.3,
    metalness: 0.5
  });
  const navRing = new THREE.Mesh(navRingGeo, navRingMat);
  navRing.rotation.x = Math.PI / 2;
  navRing.position.set(0, 0.35, 0.17);
  group.add(navRing);

  // 导航中心按钮
  const navCenterGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 24);
  const navCenterMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.25,
    metalness: 0.6
  });
  const navCenter = new THREE.Mesh(navCenterGeo, navCenterMat);
  navCenter.rotation.x = Math.PI / 2;
  navCenter.position.set(0, 0.35, 0.17);
  group.add(navCenter);

  // 音量/频道按钮 - 长条形
  const volGeo = new THREE.BoxGeometry(0.12, 0.35, 0.05);
  const volMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.4,
    metalness: 0.3
  });
  const volUp = new THREE.Mesh(volGeo, volMat);
  volUp.position.set(-0.25, 0.1, 0.16);
  group.add(volUp);
  const volDown = new THREE.Mesh(volGeo, volMat);
  volDown.position.set(0.25, 0.1, 0.16);
  group.add(volDown);

  // 数字按钮 - 3x4 网格，带弧度
  const numGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.04, 16);
  const numMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.5,
    metalness: 0.2
  });
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const btn = new THREE.Mesh(numGeo, numMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(
        (col - 1) * 0.18,
        -0.25 - row * 0.16,
        0.16
      );
      group.add(btn);
    }
  }

  // 底部电池盖 - 有缝隙感
  const batteryGeo = new THREE.BoxGeometry(0.55, 0.35, 0.26);
  const batteryMat = new THREE.MeshStandardMaterial({
    color: 0x0d0d15,
    roughness: 0.6,
    metalness: 0.2
  });
  const battery = new THREE.Mesh(batteryGeo, batteryMat);
  battery.position.set(0, -1.15, 0);
  group.add(battery);

  // 电池盖缝隙
  const gapGeo = new THREE.BoxGeometry(0.5, 0.02, 0.27);
  const gapMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.9
  });
  const gap = new THREE.Mesh(gapGeo, gapMat);
  gap.position.set(0, -1.0, 0);
  group.add(gap);

  group.rotation.y = Math.PI / 8;
  group.rotation.x = -Math.PI / 16;
  scene.add(group);
  return scene;
}

// ========== 2. 比特币（精细版） ==========
function createBitcoin() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 外圈 - 更厚更有质感
  const outerGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.15, 64);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xf7931a,
    roughness: 0.15,
    metalness: 0.9,
    emissive: 0xf7931a,
    emissiveIntensity: 0.1
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  group.add(outer);

  // 内圈 - 凹陷效果
  const innerGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.16, 64);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xd67d0e,
    roughness: 0.2,
    metalness: 0.85
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // B 字母 - 用多个几何体拼出
  const bMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.8,
    emissive: 0xffffff,
    emissiveIntensity: 0.05
  });

  // B 的竖线
  const bStemGeo = new THREE.BoxGeometry(0.12, 0.7, 0.18);
  const bStem = new THREE.Mesh(bStemGeo, bMat);
  bStem.position.set(-0.15, 0, 0.08);
  group.add(bStem);

  // B 的上半圆
  const bTopGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.18, 32, 1, false, 0, Math.PI);
  const bTop = new THREE.Mesh(bTopGeo, bMat);
  bTop.rotation.z = -Math.PI / 2;
  bTop.position.set(0.02, 0.18, 0.08);
  group.add(bTop);

  // B 的下半圆
  const bBottomGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 32, 1, false, 0, Math.PI);
  const bBottom = new THREE.Mesh(bBottomGeo, bMat);
  bBottom.rotation.z = -Math.PI / 2;
  bBottom.position.set(0.02, -0.18, 0.08);
  group.add(bBottom);

  // 两条竖线（比特币标志特征）
  const lineGeo = new THREE.BoxGeometry(0.04, 0.5, 0.19);
  const line1 = new THREE.Mesh(lineGeo, bMat);
  line1.position.set(-0.08, 0, 0.08);
  group.add(line1);
  const line2 = new THREE.Mesh(lineGeo, bMat);
  line2.position.set(0.08, 0, 0.08);
  group.add(line2);

  // 边缘齿纹
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.03, 0.06, 0.16);
    const tooth = new THREE.Mesh(toothGeo, outerMat);
    tooth.position.set(Math.cos(angle) * 1.02, Math.sin(angle) * 1.02, 0);
    tooth.rotation.z = angle;
    group.add(tooth);
  }

  group.rotation.x = Math.PI / 2;
  scene.add(group);
  return scene;
}

// ========== 3. 灯笼（精细版） ==========
function createLantern() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 灯笼主体 - 更圆润的球形
  const bodyGeo = new THREE.SphereGeometry(0.8, 32, 24);
  bodyGeo.scale(1, 1.2, 1);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xcc2222,
    roughness: 0.4,
    metalness: 0.1,
    emissive: 0x660000,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 金色骨架 - 纵向
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ribGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.9, 8);
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.3,
      metalness: 0.7
    });
    const rib = new THREE.Mesh(ribGeo, ribMat);
    rib.position.set(Math.cos(angle) * 0.75, 0, Math.sin(angle) * 0.75);
    rib.rotation.z = Math.PI / 2;
    rib.rotation.y = angle;
    group.add(rib);
  }

  // 顶部盖子
  const topGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.15, 16);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.2,
    metalness: 0.8
  });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 1.0;
  group.add(top);

  // 顶部挂环
  const ringGeo = new THREE.TorusGeometry(0.08, 0.02, 8, 16);
  const ring = new THREE.Mesh(ringGeo, topMat);
  ring.position.y = 1.15;
  group.add(ring);

  // 底部装饰
  const bottomGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.1, 16);
  const bottom = new THREE.Mesh(bottomGeo, topMat);
  bottom.position.y = -1.0;
  group.add(bottom);

  // 流苏
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const tasselGeo = new THREE.CylinderGeometry(0.01, 0.005, 0.4, 8);
    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.6,
      metalness: 0.3
    });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.set(Math.cos(angle) * 0.15, -1.25, Math.sin(angle) * 0.15);
    group.add(tassel);
  }

  // 内部光源效果
  const lightGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xffdd88,
    emissive: 0xffaa00,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.6
  });
  const light = new THREE.Mesh(lightGeo, lightMat);
  group.add(light);

  scene.add(group);
  return scene;
}

// ========== 4. 3D 画框（精细版） ==========
function createPictureFrame() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 外框 - 深色木质
  const frameGeo = new THREE.BoxGeometry(2.2, 2.8, 0.15);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3d2817,
    roughness: 0.6,
    metalness: 0.2
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // 内框 - 金色装饰线
  const innerFrameGeo = new THREE.BoxGeometry(2.0, 2.6, 0.16);
  const innerFrameMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.2,
    metalness: 0.8
  });
  const innerFrame = new THREE.Mesh(innerFrameGeo, innerFrameMat);
  group.add(innerFrame);

  // 画布区域 - 白色
  const canvasGeo = new THREE.BoxGeometry(1.9, 2.5, 0.17);
  const canvasMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e8,
    roughness: 0.8,
    metalness: 0.0
  });
  const canvas = new THREE.Mesh(canvasGeo, canvasMat);
  group.add(canvas);

  // 四角装饰
  const cornerGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const cornerMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.2,
    metalness: 0.9
  });
  const positions = [
    [-1.05, 1.35, 0.08],
    [1.05, 1.35, 0.08],
    [-1.05, -1.35, 0.08],
    [1.05, -1.35, 0.08]
  ];
  positions.forEach(pos => {
    const corner = new THREE.Mesh(cornerGeo, cornerMat);
    corner.position.set(...pos);
    group.add(corner);
  });

  // 背面支架
  const standGeo = new THREE.BoxGeometry(0.3, 1.0, 0.05);
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.7,
    metalness: 0.1
  });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, -0.5, -0.5);
  stand.rotation.x = Math.PI / 6;
  group.add(stand);

  group.rotation.y = Math.PI / 12;
  scene.add(group);
  return scene;
}

// ========== 主函数 ==========
async function main() {
  console.log('开始生成精细 3D 模型...\n');

  await exportGLB(createRemote(), 'remote_control');
  await exportGLB(createBitcoin(), 'bitcoin');
  await exportGLB(createLantern(), 'lantern');
  await exportGLB(createPictureFrame(), 'picture_frame');

  console.log('\n全部完成！');
}

main().catch(console.error);

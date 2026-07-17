// 生成所有 3D 模型 - 精细版 + 与页面内容强相关
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

// ========== 《偷懒改变世界》 ==========

// 1. 电梯（安全制动器）
function createElevator() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 电梯井框架
  const frameGeo = new THREE.BoxGeometry(1.2, 2.5, 1.2);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.6,
    metalness: 0.4,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // 电梯轿厢
  const cabinGeo = new THREE.BoxGeometry(0.9, 1.2, 0.9);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.y = -0.3;
  group.add(cabin);

  // 轿厢门
  const doorGeo = new THREE.BoxGeometry(0.7, 1.0, 0.05);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.4,
    metalness: 0.5
  });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, -0.3, 0.48);
  group.add(door);

  // 安全制动器（关键部件）- 楔形块
  const brakeGeo = new THREE.CylinderGeometry(0.15, 0.05, 0.3, 4);
  const brakeMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x440000,
    emissiveIntensity: 0.2
  });
  const brake1 = new THREE.Mesh(brakeGeo, brakeMat);
  brake1.position.set(-0.5, 0.8, 0);
  brake1.rotation.z = Math.PI / 4;
  group.add(brake1);
  const brake2 = new THREE.Mesh(brakeGeo, brakeMat);
  brake2.position.set(0.5, 0.8, 0);
  brake2.rotation.z = -Math.PI / 4;
  group.add(brake2);

  // 钢缆
  const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8);
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.3,
    metalness: 0.9
  });
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.position.y = 1.2;
  group.add(cable);

  // 滑轮
  const pulleyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const pulley = new THREE.Mesh(pulleyGeo, cableMat);
  pulley.rotation.x = Math.PI / 2;
  pulley.position.y = 2.2;
  group.add(pulley);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 2. 流水线（传送带+汽车）
function createAssemblyLine() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 传送带
  const beltGeo = new THREE.BoxGeometry(3.0, 0.1, 0.8);
  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x3d3225,
    roughness: 0.7,
    metalness: 0.3
  });
  const belt = new THREE.Mesh(beltGeo, beltMat);
  group.add(belt);

  // 传送带支架
  for (let i = -1; i <= 1; i++) {
    const legGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const leg = new THREE.Mesh(legGeo, beltMat);
    leg.position.set(i * 1.2, -0.3, 0);
    group.add(leg);
  }

  // 汽车底盘
  const chassisGeo = new THREE.BoxGeometry(0.8, 0.15, 0.4);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.4,
    metalness: 0.6
  });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(-0.8, 0.15, 0);
  group.add(chassis);

  // 车身
  const bodyGeo = new THREE.BoxGeometry(0.7, 0.25, 0.35);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.3,
    metalness: 0.5
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(-0.8, 0.35, 0);
  group.add(body);

  // 车轮
  const wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.2
  });
  const positions = [
    [-0.6, 0.08, 0.2], [-0.6, 0.08, -0.2],
    [-1.0, 0.08, 0.2], [-1.0, 0.08, -0.2]
  ];
  positions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(...pos);
    group.add(wheel);
  });

  // 工人（简化）
  const workerGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.5, 8);
  const workerMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.6,
    metalness: 0.1
  });
  const worker = new THREE.Mesh(workerGeo, workerMat);
  worker.position.set(0.5, 0.3, 0.3);
  group.add(worker);

  // 工具
  const toolGeo = new THREE.BoxGeometry(0.15, 0.05, 0.05);
  const toolMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const tool = new THREE.Mesh(toolGeo, toolMat);
  tool.position.set(0.5, 0.5, 0.3);
  tool.rotation.z = Math.PI / 4;
  group.add(tool);

  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// 3. 遥控器（精细版）
function createRemote() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 主体 - 圆角长方体
  const bodyGeo = new THREE.BoxGeometry(0.75, 2.2, 0.28, 8, 16, 4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.35,
    metalness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 顶部红外窗口
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

  // 电源按钮
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

  // 导航圆盘
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

  // 音量/频道按钮
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

  // 数字按钮
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

  // 底部电池盖
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

// 4. 集装箱
function createContainer() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 集装箱主体
  const boxGeo = new THREE.BoxGeometry(2.0, 1.0, 1.0);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x2c5f2e,
    roughness: 0.6,
    metalness: 0.4
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  group.add(box);

  // 波纹板效果
  for (let i = 0; i < 10; i++) {
    const ribGeo = new THREE.BoxGeometry(0.05, 0.95, 0.95);
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x1e4a20,
      roughness: 0.5,
      metalness: 0.5
    });
    const rib = new THREE.Mesh(ribGeo, ribMat);
    rib.position.set(-0.9 + i * 0.2, 0, 0);
    group.add(rib);
  }

  // 角件
  const cornerGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
  const cornerMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const corners = [
    [-1.0, 0.5, 0.5], [1.0, 0.5, 0.5],
    [-1.0, 0.5, -0.5], [1.0, 0.5, -0.5],
    [-1.0, -0.5, 0.5], [1.0, -0.5, 0.5],
    [-1.0, -0.5, -0.5], [1.0, -0.5, -0.5]
  ];
  corners.forEach(pos => {
    const corner = new THREE.Mesh(cornerGeo, cornerMat);
    corner.position.set(...pos);
    group.add(corner);
  });

  // 门铰链
  const hingeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
  const hingeMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.4,
    metalness: 0.8
  });
  const hinge1 = new THREE.Mesh(hingeGeo, hingeMat);
  hinge1.position.set(1.02, 0, 0.3);
  group.add(hinge1);
  const hinge2 = new THREE.Mesh(hingeGeo, hingeMat);
  hinge2.position.set(1.02, 0, -0.3);
  group.add(hinge2);

  // 锁杆
  const lockGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8);
  const lock = new THREE.Mesh(lockGeo, hingeMat);
  lock.rotation.z = Math.PI / 2;
  lock.position.set(1.05, 0, 0);
  group.add(lock);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 5. 杠杆（总结页 - 偷懒的杠杆）
function createLever() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 支点
  const fulcrumGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8);
  const fulcrumMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.6,
    metalness: 0.3
  });
  const fulcrum = new THREE.Mesh(fulcrumGeo, fulcrumMat);
  fulcrum.position.y = -0.2;
  group.add(fulcrum);

  // 杠杆臂
  const armGeo = new THREE.BoxGeometry(2.5, 0.08, 0.08);
  const armMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const arm = new THREE.Mesh(armGeo, armMat);
  arm.position.y = 0.1;
  arm.rotation.z = -Math.PI / 12;
  group.add(arm);

  // 重物（阻力）
  const weightGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const weightMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.5,
    metalness: 0.4
  });
  const weight = new THREE.Mesh(weightGeo, weightMat);
  weight.position.set(-1.0, 0.35, 0);
  group.add(weight);

  // 动力（小手）
  const handGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const handMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.4,
    metalness: 0.3
  });
  const hand = new THREE.Mesh(handGeo, handMat);
  hand.position.set(1.2, -0.05, 0);
  group.add(hand);

  // 箭头（表示方向）
  const arrowGeo = new THREE.ConeGeometry(0.05, 0.15, 8);
  const arrowMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.3,
    metalness: 0.5
  });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.set(1.35, -0.15, 0);
  arrow.rotation.z = Math.PI;
  group.add(arrow);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 《环境的秘密》 ==========

// 1. 破窗（破窗效应）
function createBrokenWindow() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 窗框
  const frameGeo = new THREE.BoxGeometry(1.5, 1.8, 0.1);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.6,
    metalness: 0.3
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // 玻璃（破碎效果 - 用多个碎片表示）
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.4
  });

  // 中心破洞
  const holeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 32);
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.9
  });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  hole.rotation.x = Math.PI / 2;
  group.add(hole);

  // 裂纹
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const crackGeo = new THREE.BoxGeometry(0.02, 0.6, 0.11);
    const crack = new THREE.Mesh(crackGeo, glassMat);
    crack.position.set(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0);
    crack.rotation.z = angle;
    group.add(crack);
  }

  // 剩余玻璃
  const remainingGeo = new THREE.BoxGeometry(1.4, 1.7, 0.05);
  const remaining = new THREE.Mesh(remainingGeo, glassMat);
  remaining.position.z = -0.03;
  group.add(remaining);

  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// 2. 期待之眼（罗森塔尔效应）
function createEye() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 眼球
  const eyeballGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const eyeballMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  });
  const eyeball = new THREE.Mesh(eyeballGeo, eyeballMat);
  group.add(eyeball);

  // 虹膜
  const irisGeo = new THREE.SphereGeometry(0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.3,
    metalness: 0.5
  });
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.rotation.x = Math.PI / 2;
  iris.position.z = 0.35;
  group.add(iris);

  // 瞳孔
  const pupilGeo = new THREE.SphereGeometry(0.12, 32, 32);
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1
  });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.z = 0.42;
  group.add(pupil);

  // 高光
  const highlightGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.8
  });
  const highlight = new THREE.Mesh(highlightGeo, highlightMat);
  highlight.position.set(0.1, 0.1, 0.45);
  group.add(highlight);

  // 睫毛
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI - Math.PI / 2;
    const lashGeo = new THREE.CylinderGeometry(0.01, 0.005, 0.2, 4);
    const lashMat = new THREE.MeshStandardMaterial({
      color: 0x2c2418,
      roughness: 0.8
    });
    const lash = new THREE.Mesh(lashGeo, lashMat);
    lash.position.set(Math.sin(angle) * 0.5, Math.cos(angle) * 0.5 + 0.2, 0.3);
    lash.rotation.z = -angle;
    lash.rotation.x = Math.PI / 4;
    group.add(lash);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 3. 跑道（4分钟魔咒）
function createTrack() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 跑道
  const trackGeo = new THREE.TorusGeometry(1.0, 0.15, 16, 32, Math.PI);
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0xcc6633,
    roughness: 0.7,
    metalness: 0.1
  });
  const track = new THREE.Mesh(trackGeo, trackMat);
  track.rotation.x = Math.PI / 2;
  group.add(track);

  // 跑道线
  for (let i = 0; i < 4; i++) {
    const lineGeo = new THREE.TorusGeometry(0.85 + i * 0.1, 0.01, 8, 32, Math.PI);
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = Math.PI / 2;
    line.position.y = 0.01;
    group.add(line);
  }

  // 起跑器
  const blockGeo = new THREE.BoxGeometry(0.15, 0.1, 0.3);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.5,
    metalness: 0.5
  });
  const block1 = new THREE.Mesh(blockGeo, blockMat);
  block1.position.set(-0.9, 0.05, 0.2);
  group.add(block1);
  const block2 = new THREE.Mesh(blockGeo, blockMat);
  block2.position.set(-0.9, 0.05, -0.2);
  group.add(block2);

  // 计时钟
  const clockGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
  const clockMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3
  });
  const clock = new THREE.Mesh(clockGeo, clockMat);
  clock.rotation.x = Math.PI / 2;
  clock.position.set(0, 0.5, 0);
  group.add(clock);

  // 指针
  const handGeo = new THREE.BoxGeometry(0.02, 0.15, 0.01);
  const handMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.3
  });
  const hand = new THREE.Mesh(handGeo, handMat);
  hand.position.set(0, 0.5, 0.03);
  hand.rotation.z = Math.PI / 3;
  group.add(hand);

  group.rotation.y = Math.PI / 4;
  scene.add(group);
  return scene;
}

// 4. 车库（硅谷）
function createGarage() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 车库主体
  const garageGeo = new THREE.BoxGeometry(2.0, 1.5, 1.5);
  const garageMat = new THREE.MeshStandardMaterial({
    color: 0x5a4a3a,
    roughness: 0.7,
    metalness: 0.2
  });
  const garage = new THREE.Mesh(garageGeo, garageMat);
  group.add(garage);

  // 车库门（半开）
  const doorGeo = new THREE.BoxGeometry(1.6, 1.2, 0.05);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x8a7a6a,
    roughness: 0.6,
    metalness: 0.3
  });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.3, 0.78);
  door.rotation.x = -Math.PI / 6;
  group.add(door);

  // 屋顶
  const roofGeo = new THREE.ConeGeometry(1.5, 0.5, 4);
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x3d3225,
    roughness: 0.7
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 1.0;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);

  // 电脑（老式）
  const computerGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
  const computerMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.4,
    metalness: 0.5
  });
  const computer = new THREE.Mesh(computerGeo, computerMat);
  computer.position.set(-0.3, -0.3, 0.3);
  group.add(computer);

  // 屏幕
  const screenGeo = new THREE.BoxGeometry(0.35, 0.25, 0.02);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x003300,
    emissiveIntensity: 0.5
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(-0.3, -0.25, 0.52);
  group.add(screen);

  // 电路板
  const boardGeo = new THREE.BoxGeometry(0.3, 0.02, 0.2);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x006600,
    roughness: 0.5
  });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0.3, -0.4, 0.2);
  group.add(board);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 5. 走廊（贝尔实验室）
function createCorridor() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 走廊地面
  const floorGeo = new THREE.BoxGeometry(4.0, 0.1, 1.0);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x8a7a6a,
    roughness: 0.6
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  group.add(floor);

  // 两侧墙壁
  const wallGeo = new THREE.BoxGeometry(4.0, 1.5, 0.1);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc8,
    roughness: 0.7
  });
  const wall1 = new THREE.Mesh(wallGeo, wallMat);
  wall1.position.set(0, 0.75, 0.5);
  group.add(wall1);
  const wall2 = new THREE.Mesh(wallGeo, wallMat);
  wall2.position.set(0, 0.75, -0.5);
  group.add(wall2);

  // 门
  for (let i = -1; i <= 1; i += 2) {
    const doorGeo = new THREE.BoxGeometry(0.6, 1.2, 0.05);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x4a4035,
      roughness: 0.5
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(i * 1.5, 0.6, 0.48);
    group.add(door);
  }

  // 窗户
  for (let i = -1; i <= 1; i += 2) {
    const windowGeo = new THREE.BoxGeometry(0.4, 0.4, 0.05);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6
    });
    const window = new THREE.Mesh(windowGeo, windowMat);
    window.position.set(i * 0.8, 0.9, -0.48);
    group.add(window);
  }

  // 人们（简化）
  const personGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8);
  const personMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.6
  });
  const person1 = new THREE.Mesh(personGeo, personMat);
  person1.position.set(-0.5, 0.35, 0);
  group.add(person1);
  const person2 = new THREE.Mesh(personGeo, personMat);
  person2.position.set(0.5, 0.35, 0);
  group.add(person2);

  // 对话气泡
  const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    transparent: true,
    opacity: 0.8
  });
  const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  bubble.position.set(0, 0.8, 0);
  group.add(bubble);

  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// 6. 书本（室友效应）
function createBooks() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 书堆
  const colors = [0xb8423a, 0x4a6fa5, 0x2c5f2e, 0xc9a84c, 0x8a4a6a];
  for (let i = 0; i < 5; i++) {
    const bookGeo = new THREE.BoxGeometry(0.6, 0.08, 0.4);
    const bookMat = new THREE.MeshStandardMaterial({
      color: colors[i],
      roughness: 0.6,
      metalness: 0.2
    });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(0, i * 0.1 - 0.2, 0);
    book.rotation.y = (Math.random() - 0.5) * 0.2;
    group.add(book);
  }

  // 游戏机
  const consoleGeo = new THREE.BoxGeometry(0.3, 0.1, 0.2);
  const consoleMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
    metalness: 0.6
  });
  const console = new THREE.Mesh(consoleGeo, consoleMat);
  console.position.set(0.5, -0.2, 0);
  group.add(console);

  // 手柄
  const controllerGeo = new THREE.BoxGeometry(0.12, 0.05, 0.08);
  const controllerMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5
  });
  const controller = new THREE.Mesh(controllerGeo, controllerMat);
  controller.position.set(0.5, -0.1, 0.15);
  group.add(controller);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 7. 手机（手机存在效应）
function createPhone() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 手机主体
  const phoneGeo = new THREE.BoxGeometry(0.35, 0.7, 0.04);
  const phoneMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.7
  });
  const phone = new THREE.Mesh(phoneGeo, phoneMat);
  group.add(phone);

  // 屏幕
  const screenGeo = new THREE.BoxGeometry(0.3, 0.6, 0.01);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x001122,
    emissiveIntensity: 0.3
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.025;
  group.add(screen);

  //  Home 键
  const homeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16);
  const homeMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.4
  });
  const home = new THREE.Mesh(homeGeo, homeMat);
  home.rotation.x = Math.PI / 2;
  home.position.set(0, -0.32, 0.025);
  group.add(home);

  // 信号波纹（干扰）
  for (let i = 1; i <= 3; i++) {
    const waveGeo = new THREE.TorusGeometry(0.1 * i, 0.01, 8, 32);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0xb8423a,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6 - i * 0.15
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.position.set(0.3, 0.3, 0);
    group.add(wave);
  }

  group.rotation.y = Math.PI / 6;
  group.rotation.x = -Math.PI / 12;
  scene.add(group);
  return scene;
}

// 8. 泡泡（过滤气泡）
function createBubble() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 主泡泡
  const bubbleGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.3
  });
  const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  group.add(bubble);

  // 内部小泡泡（信息）
  const colors = [0xb8423a, 0x4a6fa5, 0x2c5f2e, 0xc9a84c];
  for (let i = 0; i < 4; i++) {
    const smallGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const smallMat = new THREE.MeshStandardMaterial({
      color: colors[i],
      roughness: 0.4,
      transparent: true,
      opacity: 0.7
    });
    const small = new THREE.Mesh(smallGeo, smallMat);
    const angle = (i / 4) * Math.PI * 2;
    small.position.set(Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0);
    group.add(small);
  }

  // 外部泡泡（被过滤的）
  const outerGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    transparent: true,
    opacity: 0.3
  });
  const outer1 = new THREE.Mesh(outerGeo, outerMat);
  outer1.position.set(0.9, 0.3, 0);
  group.add(outer1);
  const outer2 = new THREE.Mesh(outerGeo, outerMat);
  outer2.position.set(-0.8, -0.4, 0);
  group.add(outer2);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 9. 潜水员（情境依赖记忆）
function createDiver() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 潜水员身体
  const bodyGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.6, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2c5f2e,
    roughness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 头
  const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    roughness: 0.6
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 0.4;
  group.add(head);

  // 潜水镜
  const maskGeo = new THREE.BoxGeometry(0.2, 0.1, 0.1);
  const maskMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7
  });
  const mask = new THREE.Mesh(maskGeo, maskMat);
  mask.position.set(0, 0.42, 0.08);
  group.add(mask);

  // 氧气瓶
  const tankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
  const tankMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.set(0, 0, -0.15);
  group.add(tank);

  // 脚蹼
  const finGeo = new THREE.BoxGeometry(0.15, 0.05, 0.3);
  const finMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.5
  });
  const fin1 = new THREE.Mesh(finGeo, finMat);
  fin1.position.set(-0.1, -0.35, 0.1);
  fin1.rotation.x = Math.PI / 4;
  group.add(fin1);
  const fin2 = new THREE.Mesh(finGeo, finMat);
  fin2.position.set(0.1, -0.35, 0.1);
  fin2.rotation.x = Math.PI / 4;
  group.add(fin2);

  // 气泡
  for (let i = 0; i < 5; i++) {
    const bubbleGeo = new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6
    });
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubble.position.set(
      (Math.random() - 0.5) * 0.3,
      0.5 + i * 0.15,
      (Math.random() - 0.5) * 0.3
    );
    group.add(bubble);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 10. 设计工具（总结页 - 设计你的环境）
function createDesignTools() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 尺子
  const rulerGeo = new THREE.BoxGeometry(1.0, 0.05, 0.1);
  const rulerMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const ruler = new THREE.Mesh(rulerGeo, rulerMat);
  ruler.position.set(-0.3, 0, 0);
  ruler.rotation.z = Math.PI / 6;
  group.add(ruler);

  // 铅笔
  const pencilGeo = new THREE.CylinderGeometry(0.03, 0.01, 0.5, 8);
  const pencilMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.5
  });
  const pencil = new THREE.Mesh(pencilGeo, pencilMat);
  pencil.position.set(0.3, 0.1, 0);
  pencil.rotation.z = -Math.PI / 4;
  group.add(pencil);

  // 橡皮
  const eraserGeo = new THREE.BoxGeometry(0.15, 0.08, 0.05);
  const eraserMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.6
  });
  const eraser = new THREE.Mesh(eraserGeo, eraserMat);
  eraser.position.set(0.5, -0.1, 0);
  group.add(eraser);

  // 图纸
  const paperGeo = new THREE.BoxGeometry(0.8, 0.01, 0.6);
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8
  });
  const paper = new THREE.Mesh(paperGeo, paperMat);
  paper.position.set(0, -0.2, 0);
  group.add(paper);

  // 图纸上的线条
  const lineGeo = new THREE.BoxGeometry(0.6, 0.005, 0.02);
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.5
  });
  const line1 = new THREE.Mesh(lineGeo, lineMat);
  line1.position.set(0, -0.19, 0.1);
  group.add(line1);
  const line2 = new THREE.Mesh(lineGeo, lineMat);
  line2.position.set(0, -0.19, -0.1);
  group.add(line2);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 《财富趣事》 ==========

// 1. 帆船（荷兰东印度公司）
function createShip() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 船体
  const hullGeo = new THREE.BoxGeometry(1.5, 0.4, 0.6);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x5a3a2a,
    roughness: 0.7,
    metalness: 0.2
  });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  group.add(hull);

  // 船头
  const bowGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
  const bow = new THREE.Mesh(bowGeo, hullMat);
  bow.rotation.z = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(0.9, 0, 0);
  group.add(bow);

  // 桅杆
  const mastGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
  const mastMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.6
  });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(0, 0.9, 0);
  group.add(mast);

  // 帆
  const sailGeo = new THREE.BoxGeometry(0.8, 1.0, 0.02);
  const sailMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc8,
    roughness: 0.8
  });
  const sail = new THREE.Mesh(sailGeo, sailMat);
  sail.position.set(0, 0.9, 0.1);
  group.add(sail);

  // 船帆索具
  const ropeGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 4);
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0x8a7a6a,
    roughness: 0.8
  });
  const rope1 = new THREE.Mesh(ropeGeo, ropeMat);
  rope1.position.set(-0.3, 0.9, 0);
  rope1.rotation.z = Math.PI / 6;
  group.add(rope1);
  const rope2 = new THREE.Mesh(ropeGeo, ropeMat);
  rope2.position.set(0.3, 0.9, 0);
  rope2.rotation.z = -Math.PI / 6;
  group.add(rope2);

  // 旗帜
  const flagGeo = new THREE.BoxGeometry(0.3, 0.2, 0.01);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.5
  });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(0, 1.6, 0);
  group.add(flag);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 2. 郁金香
function createTulip() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 花茎
  const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.8, 8);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x2c5f2e,
    roughness: 0.6
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  group.add(stem);

  // 叶子
  const leafGeo = new THREE.SphereGeometry(0.15, 8, 8);
  leafGeo.scale(1, 0.3, 0.5);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x3a7a3e,
    roughness: 0.6
  });
  const leaf1 = new THREE.Mesh(leafGeo, leafMat);
  leaf1.position.set(-0.1, -0.2, 0);
  leaf1.rotation.z = Math.PI / 4;
  group.add(leaf1);
  const leaf2 = new THREE.Mesh(leafGeo, leafMat);
  leaf2.position.set(0.1, -0.3, 0);
  leaf2.rotation.z = -Math.PI / 4;
  group.add(leaf2);

  // 花朵
  const petalGeo = new THREE.SphereGeometry(0.2, 16, 16);
  petalGeo.scale(1, 1.2, 1);
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.4,
    metalness: 0.2
  });
  const flower = new THREE.Mesh(petalGeo, petalMat);
  flower.position.y = 0.5;
  group.add(flower);

  // 花瓣纹理
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const stripeGeo = new THREE.SphereGeometry(0.18, 8, 8);
    stripeGeo.scale(0.3, 1.0, 0.3);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x8a2a2a,
      roughness: 0.5
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(Math.cos(angle) * 0.08, 0.5, Math.sin(angle) * 0.08);
    group.add(stripe);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 3. 纸币（密西西比泡沫）
function createBanknote() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 纸币主体
  const noteGeo = new THREE.BoxGeometry(1.2, 0.6, 0.01);
  const noteMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc8,
    roughness: 0.7
  });
  const note = new THREE.Mesh(noteGeo, noteMat);
  group.add(note);

  // 边框
  const borderGeo = new THREE.BoxGeometry(1.1, 0.5, 0.005);
  const borderMat = new THREE.MeshStandardMaterial({
    color: 0x2c5f2e,
    roughness: 0.5
  });
  const border = new THREE.Mesh(borderGeo, borderMat);
  border.position.z = 0.008;
  group.add(border);

  // 中心图案
  const centerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.01, 32);
  const centerMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.6
  });
  const center = new THREE.Mesh(centerGeo, centerMat);
  center.rotation.x = Math.PI / 2;
  center.position.z = 0.01;
  group.add(center);

  // 文字区域
  const textGeo = new THREE.BoxGeometry(0.6, 0.1, 0.005);
  const textMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.6
  });
  const text = new THREE.Mesh(textGeo, textMat);
  text.position.set(0, 0.2, 0.008);
  group.add(text);

  // 序列号
  const serialGeo = new THREE.BoxGeometry(0.3, 0.05, 0.005);
  const serial = new THREE.Mesh(serialGeo, textMat);
  serial.position.set(-0.3, -0.2, 0.008);
  group.add(serial);

  // 飘动效果
  group.rotation.z = Math.PI / 12;
  group.rotation.y = Math.PI / 8;
  scene.add(group);
  return scene;
}

// 4. 高楼（新加坡）
function createSkyscraper() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 主楼
  const towerGeo = new THREE.BoxGeometry(0.6, 2.0, 0.6);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x4a6fa5,
    roughness: 0.3,
    metalness: 0.7
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  group.add(tower);

  // 玻璃幕墙
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
      const windowGeo = new THREE.BoxGeometry(0.15, 0.15, 0.01);
      const windowMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x224466,
        emissiveIntensity: 0.2
      });
      const window = new THREE.Mesh(windowGeo, windowMat);
      window.position.set(
        -0.2 + j * 0.2,
        -0.9 + i * 0.2,
        0.31
      );
      group.add(window);
    }
  }

  // 顶部
  const topGeo = new THREE.ConeGeometry(0.4, 0.3, 4);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.8
  });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 1.15;
  top.rotation.y = Math.PI / 4;
  group.add(top);

  // 旁边小楼
  const smallGeo = new THREE.BoxGeometry(0.4, 1.0, 0.4);
  const small = new THREE.Mesh(smallGeo, towerMat);
  small.position.set(0.6, -0.5, 0);
  group.add(small);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 5. 猫（黑猫白猫）
function createCat() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 身体
  const bodyGeo = new THREE.SphereGeometry(0.25, 16, 16);
  bodyGeo.scale(1, 0.8, 1.2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.7
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 头
  const headGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0, 0.2, 0.15);
  group.add(head);

  // 耳朵
  const earGeo = new THREE.ConeGeometry(0.05, 0.1, 4);
  const ear1 = new THREE.Mesh(earGeo, bodyMat);
  ear1.position.set(-0.08, 0.32, 0.12);
  group.add(ear1);
  const ear2 = new THREE.Mesh(earGeo, bodyMat);
  ear2.position.set(0.08, 0.32, 0.12);
  group.add(ear2);

  // 眼睛
  const eyeGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x003300,
    emissiveIntensity: 0.5
  });
  const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
  eye1.position.set(-0.06, 0.22, 0.28);
  group.add(eye1);
  const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
  eye2.position.set(0.06, 0.22, 0.28);
  group.add(eye2);

  // 尾巴
  const tailGeo = new THREE.CylinderGeometry(0.03, 0.01, 0.4, 8);
  const tail = new THREE.Mesh(tailGeo, bodyMat);
  tail.position.set(0, 0, -0.3);
  tail.rotation.x = Math.PI / 4;
  group.add(tail);

  // 老鼠（在旁边）
  const mouseGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const mouseMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.7
  });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(0.4, -0.1, 0.2);
  group.add(mouse);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 6. 房子（房产）
function createHouse() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 主体
  const houseGeo = new THREE.BoxGeometry(1.0, 0.8, 0.8);
  const houseMat = new THREE.MeshStandardMaterial({
    color: 0x8a7a6a,
    roughness: 0.7
  });
  const house = new THREE.Mesh(houseGeo, houseMat);
  group.add(house);

  // 屋顶
  const roofGeo = new THREE.ConeGeometry(0.8, 0.4, 4);
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.6
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 0.6;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);

  // 门
  const doorGeo = new THREE.BoxGeometry(0.25, 0.4, 0.05);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x4a4035,
    roughness: 0.6
  });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, -0.2, 0.43);
  group.add(door);

  // 窗户
  const windowGeo = new THREE.BoxGeometry(0.2, 0.2, 0.05);
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7
  });
  const window1 = new THREE.Mesh(windowGeo, windowMat);
  window1.position.set(-0.3, 0.1, 0.43);
  group.add(window1);
  const window2 = new THREE.Mesh(windowGeo, windowMat);
  window2.position.set(0.3, 0.1, 0.43);
  group.add(window2);

  // 烟囱
  const chimneyGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
  const chimney = new THREE.Mesh(chimneyGeo, houseMat);
  chimney.position.set(0.3, 0.75, 0);
  group.add(chimney);

  // 价格标签
  const tagGeo = new THREE.BoxGeometry(0.3, 0.15, 0.01);
  const tagMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7
  });
  const tag = new THREE.Mesh(tagGeo, tagMat);
  tag.position.set(0.5, 0.3, 0.3);
  tag.rotation.z = -Math.PI / 6;
  group.add(tag);

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 7. 比特币（精细版）
function createBitcoin() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 外圈
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

  // 内圈
  const innerGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.16, 64);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xd67d0e,
    roughness: 0.2,
    metalness: 0.85
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // B 字母
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

  // 两条竖线
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

// 8. 图表（财富数据）
function createChart() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 坐标轴
  const axisXGeo = new THREE.BoxGeometry(1.5, 0.02, 0.02);
  const axisMat = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.5
  });
  const axisX = new THREE.Mesh(axisXGeo, axisMat);
  group.add(axisX);

  const axisYGeo = new THREE.BoxGeometry(0.02, 1.0, 0.02);
  const axisY = new THREE.Mesh(axisYGeo, axisMat);
  axisY.position.set(-0.75, 0.5, 0);
  group.add(axisY);

  // 柱状图
  const heights = [0.3, 0.5, 0.4, 0.7, 0.9];
  const colors = [0xb8423a, 0x4a6fa5, 0x2c5f2e, 0xc9a84c, 0x8a4a6a];
  for (let i = 0; i < 5; i++) {
    const barGeo = new THREE.BoxGeometry(0.15, heights[i], 0.15);
    const barMat = new THREE.MeshStandardMaterial({
      color: colors[i],
      roughness: 0.4,
      metalness: 0.3
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(-0.5 + i * 0.25, heights[i] / 2, 0);
    group.add(bar);
  }

  // 折线
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xb8423a,
    roughness: 0.3,
    emissive: 0x440000,
    emissiveIntensity: 0.2
  });
  for (let i = 0; i < 4; i++) {
    const lineGeo = new THREE.BoxGeometry(0.2, 0.02, 0.02);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(-0.375 + i * 0.25, (heights[i] + heights[i+1]) / 2 + 0.05, 0);
    line.rotation.z = Math.atan2(heights[i+1] - heights[i], 0.25);
    group.add(line);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// 9. 钥匙（三把钥匙）
function createKeys() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 钥匙环
  const ringGeo = new THREE.TorusGeometry(0.15, 0.02, 8, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.8
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);

  // 三把钥匙
  const keyColors = [0xb8423a, 0x4a6fa5, 0x2c5f2e];
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;

    // 钥匙柄
    const bowGeo = new THREE.TorusGeometry(0.06, 0.015, 8, 16);
    const keyMat = new THREE.MeshStandardMaterial({
      color: keyColors[i],
      roughness: 0.3,
      metalness: 0.7
    });
    const bow = new THREE.Mesh(bowGeo, keyMat);
    bow.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0);
    group.add(bow);

    // 钥匙杆
    const shaftGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
    const shaft = new THREE.Mesh(shaftGeo, keyMat);
    shaft.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0);
    shaft.rotation.z = angle + Math.PI / 2;
    group.add(shaft);

    // 钥匙齿
    const bitGeo = new THREE.BoxGeometry(0.04, 0.06, 0.02);
    const bit = new THREE.Mesh(bitGeo, keyMat);
    bit.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0);
    bit.rotation.z = angle;
    group.add(bit);
  }

  group.rotation.y = Math.PI / 6;
  scene.add(group);
  return scene;
}

// ========== 通用 ==========

// 3D 画框（精细版）
function createPictureFrame() {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // 外框
  const frameGeo = new THREE.BoxGeometry(2.2, 2.8, 0.15);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3d2817,
    roughness: 0.6,
    metalness: 0.2
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // 内框
  const innerFrameGeo = new THREE.BoxGeometry(2.0, 2.6, 0.16);
  const innerFrameMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.2,
    metalness: 0.8
  });
  const innerFrame = new THREE.Mesh(innerFrameGeo, innerFrameMat);
  group.add(innerFrame);

  // 画布区域
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

  // 《偷懒改变世界》
  await exportGLB(createElevator(), 'elevator');
  await exportGLB(createAssemblyLine(), 'assembly_line');
  await exportGLB(createRemote(), 'remote_control');
  await exportGLB(createContainer(), 'container');
  await exportGLB(createLever(), 'lever');

  // 《环境的秘密》
  await exportGLB(createBrokenWindow(), 'broken_window');
  await exportGLB(createEye(), 'eye');
  await exportGLB(createTrack(), 'track');
  await exportGLB(createGarage(), 'garage');
  await exportGLB(createCorridor(), 'corridor');
  await exportGLB(createBooks(), 'books');
  await exportGLB(createPhone(), 'phone');
  await exportGLB(createBubble(), 'bubble');
  await exportGLB(createDiver(), 'diver');
  await exportGLB(createDesignTools(), 'design_tools');

  // 《财富趣事》
  await exportGLB(createShip(), 'ship');
  await exportGLB(createTulip(), 'tulip');
  await exportGLB(createBanknote(), 'banknote');
  await exportGLB(createSkyscraper(), 'skyscraper');
  await exportGLB(createCat(), 'cat');
  await exportGLB(createHouse(), 'house');
  await exportGLB(createBitcoin(), 'bitcoin');
  await exportGLB(createChart(), 'chart');
  await exportGLB(createKeys(), 'keys');

  // 通用
  await exportGLB(createPictureFrame(), 'picture_frame');

  console.log('\n全部完成！');
}

main().catch(console.error);

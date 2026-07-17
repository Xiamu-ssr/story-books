// 生成《偷懒改变世界》遥控器 3D 模型
// 用 Three.js 程序化建模，导出 GLB

const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const fs = require('fs');
const path = require('path');

// 创建场景
const scene = new THREE.Scene();

// 遥控器主体（圆角长方体）
const remoteGroup = new THREE.Group();

// 主体 - 经典 1950s 遥控器造型
const bodyGeometry = new THREE.BoxGeometry(0.8, 2.4, 0.3, 4, 8, 2);
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x2c2418,
  roughness: 0.6,
  metalness: 0.3
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
remoteGroup.add(body);

// 顶部红外发射窗
const irGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
const irMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.2,
  metalness: 0.8,
  emissive: 0x330000,
  emissiveIntensity: 0.3
});
const irWindow = new THREE.Mesh(irGeometry, irMaterial);
irWindow.rotation.x = Math.PI / 2;
irWindow.position.set(0, 1.25, 0);
remoteGroup.add(irWindow);

// 按钮区域背景
const panelGeometry = new THREE.BoxGeometry(0.7, 1.8, 0.05);
const panelMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d3225,
  roughness: 0.4,
  metalness: 0.2
});
const panel = new THREE.Mesh(panelGeometry, panelMaterial);
panel.position.set(0, 0.2, 0.18);
remoteGroup.add(panel);

// 按钮 - 大圆按钮（电源）
const powerBtnGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
const powerBtnMaterial = new THREE.MeshStandardMaterial({
  color: 0xb8423a,
  roughness: 0.3,
  metalness: 0.5
});
const powerBtn = new THREE.Mesh(powerBtnGeometry, powerBtnMaterial);
powerBtn.rotation.x = Math.PI / 2;
powerBtn.position.set(0, 0.85, 0.22);
remoteGroup.add(powerBtn);

// 频道按钮 - 上下
const channelBtnGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.06);
const channelBtnMaterial = new THREE.MeshStandardMaterial({
  color: 0xc9a84c,
  roughness: 0.4,
  metalness: 0.3
});

const channelUp = new THREE.Mesh(channelBtnGeometry, channelBtnMaterial);
channelUp.position.set(0, 0.45, 0.22);
remoteGroup.add(channelUp);

const channelDown = new THREE.Mesh(channelBtnGeometry, channelBtnMaterial);
channelDown.position.set(0, 0.25, 0.22);
remoteGroup.add(channelDown);

// 音量按钮 - 左右
const volumeBtnGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.06);
const volumeBtnMaterial = new THREE.MeshStandardMaterial({
  color: 0x6b5d4f,
  roughness: 0.4,
  metalness: 0.3
});

const volumeUp = new THREE.Mesh(volumeBtnGeometry, volumeBtnMaterial);
volumeUp.position.set(-0.2, -0.1, 0.22);
remoteGroup.add(volumeUp);

const volumeDown = new THREE.Mesh(volumeBtnGeometry, volumeBtnMaterial);
volumeDown.position.set(0.2, -0.1, 0.22);
remoteGroup.add(volumeDown);

// 数字按钮网格 3x3
const numBtnGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
const numBtnMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a4035,
  roughness: 0.5,
  metalness: 0.2
});

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const btn = new THREE.Mesh(numBtnGeometry, numBtnMaterial);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(
      (col - 1) * 0.2,
      -0.5 - row * 0.18,
      0.22
    );
    remoteGroup.add(btn);
  }
}

// 品牌标志区域
const logoGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.02);
const logoMaterial = new THREE.MeshStandardMaterial({
  color: 0xc9a84c,
  roughness: 0.3,
  metalness: 0.6,
  emissive: 0xc9a84c,
  emissiveIntensity: 0.1
});
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, -1.0, 0.16);
remoteGroup.add(logo);

// 底部电池盖
const batteryGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.28);
const batteryMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1410,
  roughness: 0.7,
  metalness: 0.1
});
const batteryCover = new THREE.Mesh(batteryGeometry, batteryMaterial);
batteryCover.position.set(0, -1.35, 0);
remoteGroup.add(batteryCover);

// 整体旋转一点角度，展示立体感
remoteGroup.rotation.y = Math.PI / 6;
remoteGroup.rotation.x = -Math.PI / 12;

scene.add(remoteGroup);

// 导出 GLB - 使用 sync 方式
const exporter = new GLTFExporter();
const outputPath = path.join(__dirname, '../assets/models/remote_control.glb');

// 确保目录存在
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 使用 parse 的回调，但自己处理写入
exporter.parse(scene, (result) => {
  if (result instanceof ArrayBuffer) {
    fs.writeFileSync(outputPath, Buffer.from(result));
    console.log('遥控器模型已生成:', outputPath);
  } else {
    console.log('导出为 JSON 格式');
    fs.writeFileSync(outputPath.replace('.glb', '.gltf'), JSON.stringify(result));
  }
}, (error) => {
  console.error('导出错误:', error);
}, { binary: true });

import re

# Update wealth book
with open('books/wealth/index.html', 'r') as f:
    content = f.read()

# Update page size
content = content.replace('width: 92%; max-width: 900px;', 'width: 94%; max-width: 1100px;')
content = content.replace('height: 88%; max-height: 760px;', 'height: 88%; max-height: 800px;')

# Update page-media to support column layout
old_media = '''.page-media {
  width: 42%;
  flex-shrink: 0;
  border-left: 1px solid rgba(201,168,76,0.2);
  background: #f0e9dc;
  position: relative;
}'''
new_media = '''.page-media {
  width: 45%;
  flex-shrink: 0;
  border-left: 1px solid rgba(201,168,76,0.2);
  background: #f0e9dc;
  display: flex;
  flex-direction: column;
  position: relative;
}'''
content = content.replace(old_media, new_media)

# Add media-item styles
content = content.replace(
    '.page-media img {',
    '''.media-item {
  flex: 1;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.media-item:hover {
  background: rgba(201,168,76,0.1);
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.media-item model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}

.media-label {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--text-light);
  letter-spacing: 1px;
  pointer-events: none;
  background: rgba(250,246,238,0.8);
  padding: 4px 8px;
}

.media-divider {
  height: 1px;
  background: rgba(201,168,76,0.3);
  flex-shrink: 0;
}

.page-media img {'''
)

# Add modal styles
content = content.replace(
    '/* Fullscreen modal */',
    '''/* Fullscreen modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  width: 90%;
  height: 90%;
  position: relative;
}

.modal-content model-viewer {
  width: 100%;
  height: 100%;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gold);
  color: var(--bg-dark);
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(232,220,200,0.6);
  font-size: 13px;
  letter-spacing: 1px;
}

/* Fullscreen modal */'''
)

# Update responsive
content = content.replace(
    '.page-media { width: 100%; height: 35%; border-left: none; border-bottom: 1px solid rgba(201,168,76,0.2); }',
    '.page-media { width: 100%; height: 40%; border-left: none; border-bottom: 1px solid rgba(201,168,76,0.2); flex-direction: row; } .media-item { flex: 1; } .media-divider { width: 1px; height: auto; }'
)

# Update home link
content = content.replace('‹ 返回暑架', '‹ 返回书架')

# Add modal HTML
content = content.replace(
    '<!-- Progress dots -->',
    '''<!-- Fullscreen Modal -->
<div class="modal" id="modal">
  <button class="modal-close" onclick="closeModal()">×</button>
  <div class="modal-content" id="modalContent"></div>
  <div class="modal-hint">拖拽旋转 · 滚轮缩放 · 点击 × 关闭</div>
</div>

<!-- Progress dots -->'''
)

# Add modal JS
content = content.replace(
    'updateUI();',
    '''// Modal functions
function openModal(src, type) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  
  if (type === 'image') {
    content.innerHTML = `
      <model-viewer 
        src="../../assets/models/picture_frame.glb" 
        alt="3D画框"
        camera-controls 
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style="width:100%;height:100%;--poster-color: transparent;">
      </model-viewer>
    `;
  } else {
    content.innerHTML = `
      <model-viewer 
        src="${src}" 
        alt="3D模型"
        camera-controls 
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style="width:100%;height:100%;--poster-color: transparent;">
      </model-viewer>
    `;
  }
  
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

updateUI();'''
)

# Add Escape key
content = content.replace(
    "if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changePage(1); }",
    "if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changePage(1); } if (e.key === 'Escape') closeModal();"
)

# Update Bitcoin page to have image + 3D model
old_bitcoin = '''    <div class="page-media">
      <model-viewer src="../../assets/models/damaged_helmet.glb" alt="数字头盔 - 比特币的未来感" auto-rotate camera-controls shadow-intensity="1" exposure="0.8" style="--poster-color: transparent;"></model-viewer>
    </div>'''
new_bitcoin = '''    <div class="page-media">
      <div class="media-item" onclick="openModal('images/08_bitcoin.png', 'image')">
        <img src="images/08_bitcoin.png" alt="比特币插画">
        <div class="media-label">点击放大</div>
      </div>
      <div class="media-divider"></div>
      <div class="media-item" onclick="openModal('../../assets/models/bitcoin.glb', 'model')">
        <model-viewer src="../../assets/models/bitcoin.glb" alt="比特币3D模型" auto-rotate camera-controls shadow-intensity="1" exposure="0.8" style="--poster-color: transparent;"></model-viewer>
        <div class="media-label">3D模型 · 点击全屏</div>
      </div>
    </div>'''
content = content.replace(old_bitcoin, new_bitcoin)

# Update other pages to have clickable images
pages_to_update = [
    ('02_voc.png', '荷兰东印度公司'),
    ('03_tulip.png', '郁金香狂热'),
    ('04_mississippi.png', '密西西比泡沫'),
    ('05_singapore.png', '新加坡'),
    ('06_deng.png', '邓小平'),
    ('07_house.png', '房子'),
    ('09_data.png', '财富数据'),
    ('10_keys.png', '三把钥匙'),
]

for img, alt in pages_to_update:
    old = f'<div class="page-media"><img src="images/{img}" alt="{alt}"></div>'
    new = f'''<div class="page-media">
      <div class="media-item" onclick="openModal('images/{img}', 'image')">
        <img src="images/{img}" alt="{alt}">
        <div class="media-label">点击放大</div>
      </div>
    </div>'''
    content = content.replace(old, new)

with open('books/wealth/index.html', 'w') as f:
    f.write(content)

print('wealth done')

# Update environment book
with open('books/environment/index.html', 'r') as f:
    content = f.read()

# Same updates
content = content.replace('width: 92%; max-width: 900px;', 'width: 94%; max-width: 1100px;')
content = content.replace('height: 88%; max-height: 760px;', 'height: 88%; max-height: 800px;')
content = content.replace(old_media, new_media)
content = content.replace(
    '.page-media img {',
    '''.media-item {
  flex: 1;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.media-item:hover {
  background: rgba(201,168,76,0.1);
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.media-item model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}

.media-label {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--text-light);
  letter-spacing: 1px;
  pointer-events: none;
  background: rgba(250,246,238,0.8);
  padding: 4px 8px;
}

.media-divider {
  height: 1px;
  background: rgba(201,168,76,0.3);
  flex-shrink: 0;
}

.page-media img {'''
)
content = content.replace(
    '/* Fullscreen modal */',
    '''/* Fullscreen modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  width: 90%;
  height: 90%;
  position: relative;
}

.modal-content model-viewer {
  width: 100%;
  height: 100%;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gold);
  color: var(--bg-dark);
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(232,220,200,0.6);
  font-size: 13px;
  letter-spacing: 1px;
}

/* Fullscreen modal */'''
)
content = content.replace(
    '.page-media { width: 100%; height: 35%; border-left: none; border-bottom: 1px solid rgba(201,168,76,0.2); }',
    '.page-media { width: 100%; height: 40%; border-left: none; border-bottom: 1px solid rgba(201,168,76,0.2); flex-direction: row; } .media-item { flex: 1; } .media-divider { width: 1px; height: auto; }'
)
content = content.replace('‹ 返回暑架', '‹ 返回书架')
content = content.replace(
    '<!-- Progress dots -->',
    '''<!-- Fullscreen Modal -->
<div class="modal" id="modal">
  <button class="modal-close" onclick="closeModal()">×</button>
  <div class="modal-content" id="modalContent"></div>
  <div class="modal-hint">拖拽旋转 · 滚轮缩放 · 点击 × 关闭</div>
</div>

<!-- Progress dots -->'''
)
content = content.replace(
    'updateUI();',
    '''// Modal functions
function openModal(src, type) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  
  if (type === 'image') {
    content.innerHTML = `
      <model-viewer 
        src="../../assets/models/picture_frame.glb" 
        alt="3D画框"
        camera-controls 
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style="width:100%;height:100%;--poster-color: transparent;">
      </model-viewer>
    `;
  } else {
    content.innerHTML = `
      <model-viewer 
        src="${src}" 
        alt="3D模型"
        camera-controls 
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style="width:100%;height:100%;--poster-color: transparent;">
      </model-viewer>
    `;
  }
  
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

updateUI();'''
)
content = content.replace(
    "if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changePage(1); }",
    "if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changePage(1); } if (e.key === 'Escape') closeModal();"
)

# Update Bell Labs page to have image + 3D model
old_bell = '''    <div class="page-media">
      <model-viewer src="../../assets/models/Lantern.glb" alt="贝尔实验室的灵感之灯" auto-rotate camera-controls shadow-intensity="1" exposure="0.8" style="--poster-color: transparent;"></model-viewer>
    </div>'''
new_bell = '''    <div class="page-media">
      <div class="media-item" onclick="openModal('images/06_bell.png', 'image')">
        <img src="images/06_bell.png" alt="贝尔实验室插画">
        <div class="media-label">点击放大</div>
      </div>
      <div class="media-divider"></div>
      <div class="media-item" onclick="openModal('../../assets/models/lantern.glb', 'model')">
        <model-viewer src="../../assets/models/lantern.glb" alt="灯笼3D模型" auto-rotate camera-controls shadow-intensity="1" exposure="0.8" style="--poster-color: transparent;"></model-viewer>
        <div class="media-label">3D模型 · 点击全屏</div>
      </div>
    </div>'''
content = content.replace(old_bell, new_bell)

# Update other pages
env_pages = [
    ('02_subway.png', '破窗效应'),
    ('03_rosenthal.png', '罗森塔尔效应'),
    ('04_mile.png', '4分钟魔咒'),
    ('05_siliconvalley.png', '硅谷'),
    ('07_roommate.png', '室友效应'),
    ('08_phone.png', '手机存在'),
    ('09_bubble.png', '过滤气泡'),
    ('10_diver.png', '情境记忆'),
    ('12_ending.png', '设计环境'),
]

for img, alt in env_pages:
    old = f'<div class="page-media"><img src="images/{img}" alt="{alt}"></div>'
    new = f'''<div class="page-media">
      <div class="media-item" onclick="openModal('images/{img}', 'image')">
        <img src="images/{img}" alt="{alt}">
        <div class="media-label">点击放大</div>
      </div>
    </div>'''
    content = content.replace(old, new)

with open('books/environment/index.html', 'w') as f:
    f.write(content)

print('environment done')

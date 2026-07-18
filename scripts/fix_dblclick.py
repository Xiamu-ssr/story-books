#!/usr/bin/env python3
"""统一修复三本书的双击放大问题：
1. 给 env/wealth 补上缺失的 .modal CSS（lazy 已有，且补充 img 样式）
2. 预览区 model-viewer 加 pointer-events:none，让双击透传到 .media-item
3. openModal 图片分支：空白画框 -> 直接显示大图
4. 统一 media-label 文字为「双击放大 / 3D模型·双击全屏」
5. 模态框提示文字区分图片/3D
"""
import re
from pathlib import Path

ROOT = Path('/Users/xiamu/Code/wealth-stories/books')

MODAL_CSS = '''
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

.modal-close:hover {
  transform: scale(1.1);
}

.modal-content {
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content model-viewer {
  width: 100%;
  height: 100%;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
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
'''

NEW_OPEN_MODAL = '''// Modal functions
function openModal(src, type) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  const hint = modal.querySelector('.modal-hint');

  if (type === 'image') {
    content.innerHTML = `<img src="${src}" alt="放大图片">`;
    if (hint) hint.textContent = '点击 × 或按 ESC 关闭';
  } else {
    content.innerHTML = `
      <model-viewer
        src="${src}"
        alt="3D模型"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1.3"
        style="width:100%;height:100%;--poster-color: transparent;">
      </model-viewer>
    `;
    if (hint) hint.textContent = '拖拽旋转 · 滚轮缩放 · 点击 × 关闭';
  }

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// 点击图片背景区域也可关闭
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal' || e.target.id === 'modalContent') closeModal();
});
'''

for book in ['environment', 'wealth', 'lazy']:
    p = ROOT / book / 'index.html'
    html = p.read_text(encoding='utf-8')
    orig = html

    # 1) 补 .modal CSS：插在 </style> 前（若缺失）
    if '.modal {' not in html:
        html = html.replace('</style>', MODAL_CSS + '</style>', 1)
        print(f'[{book}] 补入 .modal CSS')
    else:
        # lazy 已有：给 .modal-content 补 flex 居中和 img 样式
        if '.modal-content img' not in html:
            html = html.replace(
                '.modal-content model-viewer {',
                '''.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.modal-content model-viewer {''', 1)
        html = html.replace(
            '''.modal-content {
  width: 90%;
  height: 90%;
  position: relative;
}''',
            '''.modal-content {
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}''', 1)
        print(f'[{book}] 已有 .modal CSS，补充 img/flex')

    # 2) 预览区 model-viewer 加 pointer-events:none
    html = html.replace(
        '''.media-item model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}''',
        '''.media-item model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
}''')

    # 3) 替换 openModal / closeModal 实现
    html = re.sub(
        r'// Modal functions\nfunction openModal.*?\nfunction closeModal\(\) \{.*?\n\}\n',
        NEW_OPEN_MODAL,
        html,
        flags=re.S,
    )

    # 4) 统一 media-label 文字
    html = html.replace('<div class="media-label">点击放大</div>',
                        '<div class="media-label">双击放大</div>')
    html = html.replace('<div class="media-label">3D模型 · 点击全屏</div>',
                        '<div class="media-label">3D模型 · 双击全屏</div>')

    if html != orig:
        p.write_text(html, encoding='utf-8')
        n_mv = html.count('pointer-events: none;')
        print(f'[{book}] ✓ 已更新（pointer-events 出现 {n_mv} 次）')
    else:
        print(f'[{book}] - 无变化')

print('\n完成')

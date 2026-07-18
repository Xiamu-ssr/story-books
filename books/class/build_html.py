#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 class_data.py 生成 books/class/index.html（基于 environment 模板结构）"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from class_data import PAGES

CN_NUM = ["壹","贰","叁","肆","伍","陆","柒","捌","玖","拾","拾壹","拾贰","拾叁","拾肆","拾伍","拾陆","拾柒","拾捌"]

def read_template():
    with open(os.path.join(HERE, "..", "environment", "index.html"), encoding="utf-8") as f:
        return f.read()

tpl = read_template()
head = tpl[:tpl.index("<div id=\"book\">")].replace("<title>环境的秘密</title>", "<title>阶级的秘密 · 点点的书架</title>")
# 从 environment 提取 <script> 及其后内容（含 nav/modal/dots/script），再改 totalPages
tail = tpl[tpl.index("<!-- Navigation -->"):]
tail = tail.replace("const totalPages = 11;", "const totalPages = 18;")

parts = [head, "<div id=\"book\">\n\n"]

# 封面
parts.append("""  <!-- Page 0: Cover -->
  <div class="page cover active" data-page="0">
    <div class="cover-bg">
      <img src="images/01_cover.png" alt="阶级的秘密">
    </div>
    <div class="page-content">
      <div class="cover-title">阶级的秘密</div>
      <div class="cover-subtitle">谁干活，谁拿钱，谁定规则，谁兜底</div>
      <div class="cover-meta">讲给点点的 17 个故事</div>
    </div>
  </div>
""")

# 内容页：封面页也用 3D？前三本封面不带媒体。内容页 17 个。
for idx, (num, fname, title, subtitle, paras, takeaway, img_prompt, model, model_alt) in enumerate(PAGES[1:]):
    img_file = f"images/{num}_{fname}.png"
    glb = f"../../assets/models/{model}.glb"
    body = "\n".join(f"        <p>{p}</p>" for p in paras)
    parts.append(f"""
  <!-- Page {idx+1}: {title} -->
  <div class="page" data-page="{idx+1}">
    <div class="page-content">
      <div class="page-title">{title}</div>
      <div class="page-subtitle">{subtitle}</div>
      <div class="page-body">
{body}
        <div class="key-takeaway">
          <strong>阶级逻辑：</strong>{takeaway}
        </div>
      </div>
      <div class="page-num">{CN_NUM[idx]}</div>
    </div>
    <div class="page-media">
      <div class="media-item" ondblclick="openModal('{img_file}', 'image')">
        <img src="{img_file}" alt="{title}">
        <div class="media-label">双击放大</div>
      </div>
      <div class="media-divider"></div>
      <div class="media-item" ondblclick="openModal('{glb}', 'model')">
        <model-viewer src="{glb}" alt="{model_alt}" auto-rotate camera-controls shadow-intensity="1" exposure="0.8" style="--poster-color: transparent;"></model-viewer>
        <div class="media-label">3D模型 · 双击全屏</div>
      </div>
    </div>
  </div>
""")

parts.append("\n</div>\n\n")
parts.append(tail)

out = os.path.join(HERE, "index.html")
with open(out, "w", encoding="utf-8") as f:
    f.write("".join(parts))
print("written", out, os.path.getsize(out), "bytes")

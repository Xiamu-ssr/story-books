#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate illustrations for 《钱是什么》 using zenmux/gemini."""

import os, sys, time
from google import genai
from google.genai import types

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from money_data import PAGES, STYLE

API_KEY = "sk-ss-v1-861ea501e8ea28c97e1a6bf249e6917f43c2e145cf2bcdbf04fc3a4d2afc38b3"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT_DIR, exist_ok=True)

client = genai.Client(
    api_key=API_KEY,
    vertexai=True,
    http_options=types.HttpOptions(api_version='v1', base_url='https://zenmux.ai/api/vertex-ai')
)

COVER_PROMPT = (
    "An open children's storybook, from its pages rises a glowing spiral of objects: "
    "a sheep, cowrie shells, a gold coin, an ancient Chinese jiaozi paper note, a gold bar, "
    "a smartphone with QR code, and a bitcoin, all flowing upward and merging into a ceramic piggy bank. "
    "Warm gold and deep teal palette, hopeful and magical."
)

images = []
for idx, (num, fname, title, subtitle, body, takeaway, img_prompt, model_name, model_alt) in enumerate(PAGES):
    if idx == 0:
        images.append((f"{num}_cover.png", f"{COVER_PROMPT} {STYLE}"))
    else:
        images.append((f"{num}_{fname}.png", f"{img_prompt} {STYLE}"))

for i, (fname, prompt) in enumerate(images):
    out_path = os.path.join(OUT_DIR, fname)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[{i+1}/{len(images)}] {fname} already exists, skipping")
        continue
    print(f"[{i+1}/{len(images)}] Generating {fname} ...")
    ok = False
    for attempt in range(3):
        try:
            p = prompt
            if attempt == 1:
                p = prompt + " Highly detailed, vivid scene, masterpiece."
            elif attempt == 2:
                p = prompt + " Simple clear composition, storybook art."
            resp = client.models.generate_content(
                model="google/gemini-3.1-flash-image",
                contents=[p],
                config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
            )
            for part in resp.parts:
                if part.inline_data is not None:
                    image = part.as_image()
                    image.save(out_path)
                    print(f"  Saved {out_path} ({os.path.getsize(out_path)} bytes)")
                    ok = True
                elif part.text:
                    print(f"  Text: {part.text[:100]}")
            if ok:
                break
            print(f"  WARNING: No image in response (attempt {attempt+1})")
            time.sleep(3)
        except Exception as e:
            print(f"  ERROR (attempt {attempt+1}): {e}")
            time.sleep(5)
    if not ok:
        print(f"  !!! FAILED: {fname}")
    time.sleep(2)

print("\nDone! All images in", OUT_DIR)

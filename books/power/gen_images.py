#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate illustrations for 《谁说了算》 using zenmux/gemini.
Run with: "$DAIMON_USER_PYTHON" books/power/gen_images.py
"""

import os, sys, time
from google import genai
from google.genai import types

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from power_data import PAGES, STYLE

API_KEY = "sk-ss-v1-861ea501e8ea28c97e1a6bf249e6917f43c2e145cf2bcdbf04fc3a4d2afc38b3"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT_DIR, exist_ok=True)

client = genai.Client(
    api_key=API_KEY,
    vertexai=True,
    http_options=types.HttpOptions(api_version='v1', base_url='https://zenmux.ai/api/vertex-ai')
)

COVER_PROMPT = (
    "An open children's storybook, and rising from its pages a glowing spiral made of "
    "a spear, a crown, a Magna Carta scroll, a ballot box, and an AI brain, all flowing "
    "upward into one warm lantern of responsibility. Solemn yet hopeful, bronze and "
    "slate blue with warm gold, cinematic light."
)

# (filename, prompt)
images = [("01_cover.png", f"{COVER_PROMPT} {STYLE}")]

for page in PAGES[1:]:
    num, file_key, title, subtitle, paragraphs, takeaway, img_prompt, model_name, model_alt = page
    fname = f"{num}_{file_key}.png"
    images.append((fname, f"{img_prompt} {STYLE}"))

assert len(images) == 13, f"expect 13 images, got {len(images)}"

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
            if attempt > 0:
                p = prompt + " (simple clear composition, child-friendly storybook scene)"
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
        except Exception as e:
            print(f"  ERROR (attempt {attempt+1}): {e}")
            time.sleep(5)
    time.sleep(2)

print("\nDone! All images in", OUT_DIR)

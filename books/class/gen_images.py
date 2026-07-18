#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate illustrations for 《阶级的秘密》 using zenmux/gemini."""

import os, sys, time
from google import genai
from google.genai import types

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from class_data import PAGES, STYLE

API_KEY = "sk-ss-v1-861ea501e8ea28c97e1a6bf249e6917f43c2e145cf2bcdbf04fc3a4d2afc38b3"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT_DIR, exist_ok=True)

client = genai.Client(
    api_key=API_KEY,
    vertexai=True,
    http_options=types.HttpOptions(api_version='v1', base_url='https://zenmux.ai/api/vertex-ai')
)

COVER_PROMPT = ("An open children's storybook on a wooden desk, and rising from its pages a glowing spiral timeline of history: "
                "a bison, wheat stalks, a clay tablet, an imperial exam paper, an admission ticket, a tower of coins, "
                "another wheat stalk, finally flowing into a luminous tablet screen at the top. Warm golden light, hopeful mood.")

images = [("01_cover.png", f"{COVER_PROMPT} {STYLE}")]
for (num, fname, title, subtitle, paras, takeaway, img_prompt, model, model_alt) in PAGES[1:]:
    images.append((f"{num}_{fname}.png", f"{img_prompt} {STYLE}"))

for i, (fname, prompt) in enumerate(images):
    out_path = os.path.join(OUT_DIR, fname)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[{i+1}/{len(images)}] {fname} already exists, skipping")
        continue
    print(f"[{i+1}/{len(images)}] Generating {fname} ...", flush=True)
    ok = False
    for attempt in range(4):
        try:
            resp = client.models.generate_content(
                model="google/gemini-3.1-flash-image",
                contents=[prompt],
                config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
            )
            for part in resp.parts:
                if part.inline_data is not None:
                    image = part.as_image()
                    image.save(out_path)
                    print(f"  Saved {out_path} ({os.path.getsize(out_path)} bytes)", flush=True)
                    ok = True
                elif part.text:
                    print(f"  Text: {part.text[:100]}", flush=True)
            if ok:
                break
            print(f"  WARNING: No image in response (attempt {attempt+1})", flush=True)
        except Exception as e:
            print(f"  ERROR (attempt {attempt+1}): {e}", flush=True)
            time.sleep(8)
    if not ok:
        print(f"  !!! FAILED to generate {fname}", flush=True)
    time.sleep(2)

print("\nDone! All images in", OUT_DIR)

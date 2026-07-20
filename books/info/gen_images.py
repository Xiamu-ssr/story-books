#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate illustrations for 《眼见为虚》 using zenmux/gemini."""

import os, sys, time
from google import genai
from google.genai import types

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from info_data import PAGES, STYLE

API_KEY = "sk-ss-v1-861ea501e8ea28c97e1a6bf249e6917f43c2e145cf2bcdbf04fc3a4d2afc38b3"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT_DIR, exist_ok=True)

client = genai.Client(
    api_key=API_KEY,
    vertexai=True,
    http_options=types.HttpOptions(api_version='v1', base_url='https://zenmux.ai/api/vertex-ai')
)

COVER_PROMPT = (
    "An open children's storybook, and rising from its pages a luminous spiral of media history: "
    "ancient beacon fire towers, hand-copied manuscripts, a Gutenberg printing press, newspapers, "
    "a vintage radio, a television set, a smartphone, and glowing AI circuitry, all flowing upward "
    "and merging into a bright lighthouse beam. Ink indigo and warm amber palette with crimson accents, "
    "vigilant yet warm. " + STYLE
)

def tweak_prompt(prompt, attempt):
    """微调 prompt 用于重试。"""
    if attempt == 1:
        return prompt + " High quality illustration, rich detail."
    if attempt == 2:
        return prompt.replace(", no text.", ", wordless, no text.")
    return prompt

def gen_one(fname, prompt, idx, total):
    out_path = os.path.join(OUT_DIR, fname)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[{idx}/{total}] {fname} already exists, skipping")
        return True
    print(f"[{idx}/{total}] Generating {fname} ...")
    for attempt in range(3):
        try:
            resp = client.models.generate_content(
                model="google/gemini-3.1-flash-image",
                contents=[tweak_prompt(prompt, attempt)],
                config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
            )
            saved = False
            for part in resp.parts:
                if part.inline_data is not None:
                    image = part.as_image()
                    image.save(out_path)
                    print(f"  Saved {out_path} ({os.path.getsize(out_path)} bytes)")
                    saved = True
                elif part.text:
                    print(f"  Text: {part.text[:100]}")
            if saved:
                return True
            print(f"  WARNING: No image in response (attempt {attempt+1})")
        except Exception as e:
            print(f"  ERROR (attempt {attempt+1}): {e}")
            time.sleep(5)
    return False

def main():
    # (filename, prompt) 列表：封面 + PAGES[1:] 每页
    tasks = [("01_cover.png", COVER_PROMPT)]
    for (num, slug, title, subtitle, paras, takeaway, img_prompt, model_name, model_alt) in PAGES[1:]:
        tasks.append((f"{num}_{slug}.png", f"{img_prompt} {STYLE}"))

    results = []
    for i, (fname, prompt) in enumerate(tasks):
        ok = gen_one(fname, prompt, i + 1, len(tasks))
        results.append((fname, ok))
        time.sleep(2)

    print("\n===== SUMMARY =====")
    for fname, ok in results:
        print(f"  {'OK ' if ok else 'FAIL'} {fname}")
    fails = [f for f, ok in results if not ok]
    print(f"\nDone! {len(results) - len(fails)}/{len(results)} images in {OUT_DIR}")
    if fails:
        sys.exit(1)

if __name__ == "__main__":
    main()

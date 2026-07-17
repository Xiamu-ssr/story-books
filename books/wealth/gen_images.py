#!/usr/bin/env python3
"""Generate illustrations for 《历史中那些财富趣事》 using zenmux/gemini."""

import os, sys, time
from google import genai
from google.genai import types

API_KEY = "sk-ss-v1-861ea501e8ea28c97e1a6bf249e6917f43c2e145cf2bcdbf04fc3a4d2afc38b3"
OUT_DIR = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT_DIR, exist_ok=True)

client = genai.Client(
    api_key=API_KEY,
    vertexai=True,
    http_options=types.HttpOptions(api_version='v1', base_url='https://zenmux.ai/api/vertex-ai')
)

# (filename, prompt)
images = [
    ("01_cover.png",
     "An artistic illustration representing wealth through history: a golden coin, a 17th century sailing ship, a tulip flower, a paper banknote, a modern skyscraper, and a glowing digital coin, all arranged in a circular composition on an aged parchment background. Rich warm colors, detailed digital painting style, no text."),

    ("02_voc.png",
     "A 17th century Dutch East Indiaman merchant ship sailing on the ocean, with merchants and traders watching from the dock of Amsterdam port. The ship is large with sails unfurled. Golden afternoon light, detailed historical painting style, cinematic composition, no text."),

    ("03_tulip.png",
     "A beautiful field of colorful tulips in 17th century Holland, with a crowd of people in period clothing eagerly trading tulip bulbs. A grand Amsterdam canal house is visible in the background. Vibrant colors, detailed digital painting, slightly whimsical, no text."),

    ("04_mississippi.png",
     "An 18th century scene in Paris: a confident man (John Law) standing at a table printing paper banknotes, while a frantic crowd of people in elegant baroque clothing pushes and shoves to buy stocks. The street is narrow and crowded, chaos and excitement. Warm oil painting style, dramatic lighting, no text."),

    ("05_singapore.png",
     "A split illustration: the left side shows a poor fishing village with wooden stilt houses in 1965, the right side shows a gleaming modern Singapore skyline with Marina Bay Sands skyscrapers in 2020. Transformation and progress. Detailed digital painting, warm to cool color transition, no text."),

    ("06_deng.png",
     "A 1978 scene: an elderly Chinese leader in a Mao suit standing on a balcony overlooking modern Singapore factories and port, looking thoughtful and inspired. Warm tropical light, historical painting style, dignified composition, no text."),

    ("07_house.png",
     "A tall Chinese residential apartment building covered with price tags showing increasing numbers, with a Chinese family looking up at it with mixed expressions of shock and calculation. Modern urban setting, slightly stylized illustration, warm but slightly anxious mood, no text."),

    ("08_bitcoin.png",
     "A mysterious hooded figure sitting at a computer desk in a dark room, the screen glowing with golden light, floating golden digital coins emerging from the screen. The first block of code visible on screen. Cinematic, moody lighting, cyberpunk meets gold rush aesthetic, no text."),

    ("09_data.png",
     "An artistic data visualization: a large pie chart made of gold showing 1% vs 99%, surrounded by floating numbers, bar charts showing exponential growth curves, and coins arranged in increasingly unequal stacks. Modern infographic art style, deep blue and gold color scheme, no text."),

    ("10_keys.png",
     "Three ornate golden keys arranged elegantly on a velvet cushion. Each key has a subtle symbol: one has a wave (risk), one has an hourglass (time), one has a handshake (credit). Rich warm lighting, treasure chamber atmosphere, detailed digital painting, no text."),
]

for i, (fname, prompt) in enumerate(images):
    out_path = os.path.join(OUT_DIR, fname)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[{i+1}/10] {fname} already exists, skipping")
        continue
    print(f"[{i+1}/10] Generating {fname} ...")
    try:
        resp = client.models.generate_content(
            model="google/gemini-3.1-flash-image",
            contents=[prompt],
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
        if not saved:
            print(f"  WARNING: No image in response!")
    except Exception as e:
        print(f"  ERROR: {e}")
    time.sleep(2)  # rate limit safety

print("\nDone! All images in", OUT_DIR)

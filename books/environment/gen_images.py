#!/usr/bin/env python3
"""Generate illustrations for 《环境的秘密》 using zenmux/gemini."""

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

STYLE = "Fresh detailed digital painting, teal green and soft gold color palette, luminous natural light, slightly dreamlike modern illustration, no text."

# (filename, prompt)
images = [
    ("01_cover.png",
     f"A young sapling growing in the center, its branches and leaves subtly shaped by what surrounds it: on one side warm library bookshelves and glowing lamps, on the other side neon city screens and noise, roots reaching toward the brighter side. Symbolic, hopeful. {STYLE}"),

    ("02_subway.png",
     f"A split scene of a New York subway car: left half is the 1980s version covered in chaotic graffiti, dim and grimy; right half is the same car transformed, clean silver and brightly lit with calm passengers reading. A mop and fresh paint bucket at the dividing line. {STYLE}"),

    ("03_rosenthal.png",
     f"A warm 1960s classroom: a teacher looking at ordinary students, but above a few children's heads float soft glowing halos of light and sprouting seedlings, the children sitting taller, eyes bright, as if the teacher's gaze itself is sunlight. {STYLE}"),

    ("04_mile.png",
     f"A 1954 athletics track scene: a runner in white vintage kit bursting through the finish tape with agonized triumphant face, a giant stopwatch in the sky showing just under four minutes, and behind him ghostly silhouettes of many other runners following through the same broken barrier. {STYLE}"),

    ("05_siliconvalley.png",
     f"A humble wooden garage with its door open, two young men tinkering with electronics inside, and out of the garage roof grows a glowing city of glass towers and circuit-board streets stretching into orchards of fruit trees. California golden hour. {STYLE}"),

    ("06_bell.png",
     f"An impossibly long mid-century office corridor (Bell Labs) with doors on both sides, scientists walking and colliding into friendly conversations, and where they meet, small bursts of light and floating equations and transistor shapes spark above their heads. {STYLE}"),

    ("07_roommate.png",
     f"A college dorm room at night: two desks side by side, one student deeply focused under a warm study lamp, and the golden glow from that lamp gently spreading across the room to the second student who is putting down a game controller and opening a book. {STYLE}"),

    ("08_phone.png",
     f"A student trying to solve math problems at a desk, while a smartphone lying face-down nearby glows faintly and pulls thin luminous threads out of the student's head toward itself like an invisible magnet, the student unaware. Slightly surreal. {STYLE}"),

    ("09_bubble.png",
     f"A teenager walking inside a large transparent bubble made of dozens of curved video screens, every screen showing nearly the same content, while outside the bubble a vast colorful world of mountains, libraries, sports and people goes unseen. {STYLE}"),

    ("10_diver.png",
     f"A surreal split-level ocean scene: scuba divers sitting cross-legged on the seabed studying flashcards among curious fish, and above the waterline the same divers on a boat looking confused at blank cards. Playful science-experiment mood. {STYLE}"),

    ("11_design.png",
     f"A teenager's bedroom being cleverly redesigned, shown like a cutaway diagram: a guitar placed on a stand in the center of the room, books stacked on the pillow, running shoes by the door, and the smartphone locked away in a distant kitchen drawer glowing faintly. {STYLE}"),

    ("12_ending.png",
     f"A person as a calm gardener at sunrise, rearranging their own life like a garden: moving a small tree, placing stepping stones toward a library, redirecting a stream, planting flowers near a desk, city skyline softly in the background. Hopeful and empowering. {STYLE}"),
]

for i, (fname, prompt) in enumerate(images):
    out_path = os.path.join(OUT_DIR, fname)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[{i+1}/{len(images)}] {fname} already exists, skipping")
        continue
    print(f"[{i+1}/{len(images)}] Generating {fname} ...")
    ok = False
    for attempt in range(3):
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

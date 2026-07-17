#!/usr/bin/env python3
"""Generate illustrations for 《偷懒改变世界》 using zenmux/gemini."""

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

STYLE = "Warm playful digital painting, rich orange and cream color palette, slightly whimsical cartoon-realism, cinematic lighting, no text."

# (filename, prompt)
images = [
    ("01_cover.png",
     f"A whimsical circular composition celebrating lazy inventions: a TV remote control, a cup of instant noodles, an elevator, a shipping container, a microwave oven, a QR code pattern, and a small robot, all floating around a person relaxing in a hammock with a satisfied smile. {STYLE}"),

    ("02_elevator.png",
     f"Dramatic 1854 scene at the New York Crystal Palace exhibition: a man in Victorian clothing (Elisha Otis) standing confidently on an open elevator platform high above a gasping crowd, while an assistant cuts the hoisting rope with an axe. The platform holds firm. Grand iron-and-glass exhibition hall. {STYLE}"),

    ("03_dishwasher.png",
     f"A determined wealthy Victorian woman in 1880s dress (Josephine Cochrane) in a workshop shed, proudly presenting a hand-built machine with wire racks holding china plates and copper water pipes spraying water, tools scattered around. {STYLE}"),

    ("04_assembly.png",
     f"A 1913 Ford factory: a long moving assembly line carrying black Model T car bodies past rows of workers, each installing one part as cars glide by, gears and chains visible, sense of smooth flowing motion. {STYLE}"),

    ("05_microwave.png",
     f"A 1945 laboratory scene: a surprised engineer in shirt and tie (Percy Spencer) standing next to a large radar magnetron device, holding up a dripping melted chocolate bar from his pocket, popcorn kernels popping in the air around him. {STYLE}"),

    ("06_remote.png",
     f"A cozy 1955 American living room: a delighted man sinking deep in a comfy armchair, pointing a futuristic ray-gun-shaped remote control (Zenith Flash-Matic) at a vintage television across the room, a beam of light connecting them, slippers on, snacks nearby. {STYLE}"),

    ("07_container.png",
     f"A split harbor scene: left side shows exhausted 1950s dockworkers carrying sacks and crates one by one up a gangplank; right side shows a giant crane effortlessly lifting one huge uniform steel shipping container onto a massive ship. Transformation from chaos to order. {STYLE}"),

    ("08_noodles.png",
     f"A small backyard wooden shed in 1958 Japan at night, warm light spilling out: an older Japanese man (Momofuku Ando) joyfully lifting golden flash-fried noodles from a wok of hot oil, steam rising, his family peeking through the doorway. {STYLE}"),

    ("09_copypaste.png",
     f"A 1970s computer research lab (Xerox PARC): a bearded programmer at an early personal computer, a paragraph of glowing text lifting off the screen and duplicating itself in mid-air like magic, floppy disks and coffee mugs on the desk. {STYLE}"),

    ("10_qrcode.png",
     f"A Japanese engineer in the 1990s playing the board game Go during lunch break, looking down at the black and white stones on the grid board with a flash of inspiration, the pattern morphing into a QR code floating above the board. {STYLE}"),

    ("11_programmer.png",
     f"A relaxed programmer leaning back with feet on desk and a cat on lap, pressing a single glowing key on a keyboard, and from the screen an army of tiny cheerful robots marches out carrying folders, sorting files, and doing chores automatically. {STYLE}"),

    ("12_ending.png",
     f"A fork in a country road under warm sunset: the left path leads to a person sleeping under a tree surrounded by broken unused tools and weeds; the right path leads uphill where a person rides a clever self-built machine with windmills and pulleys doing the farm work joyfully. {STYLE}"),
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

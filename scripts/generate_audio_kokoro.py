#!/usr/bin/env python3
import sys, json, subprocess, os
from pathlib import Path

FPS        = 60
VOICE_NAME = "am_fenrir"
SPEED      = 1.0
LANG       = "hi"
AUDIO_DIR  = Path("public/audio")
SEG_DIR    = AUDIO_DIR / "segments"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
SEG_DIR.mkdir(parents=True, exist_ok=True)

TOTAL_FRAMES = 2700

# Script for "Why You Shouldn't Hold Your Sneeze"
SCENES = [
    { "id": "s01", "fs": 15,   "fe": 180,  "text": "क्या आप भी अपनी छींक रोकते हैं? रुकिए! ये आपकी जान ले सकता है।" },
    { "id": "s02", "fs": 220,  "fe": 480,  "text": "एक छींक की रफ़्तार 160 किलोमीटर प्रति घंटा तक हो सकती है।" },
    { "id": "s03", "fs": 520,  "fe": 800,  "text": "जब आप अपनी नाक और मुँह बंद करके इसे रोकते हैं..." },
    { "id": "s04", "fs": 840,  "fe": 1100, "text": "तो ये सारा प्रेशर बाहर निकलने के बजाय आपके शरीर के अंदर वापस चला जाता है।" },
    { "id": "s05", "fs": 1140, "fe": 1400, "text": "ये प्रेशर आपके कान के पर्दों को फाड़ सकता है।" },
    { "id": "s06", "fs": 1440, "fe": 1700, "text": "आपकी आँखों की नसों को फोड़ सकता है।" },
    { "id": "s07", "fs": 1740, "fe": 2050, "text": "और बहुत ही कम मामलों में ये आपके दिमाग की नस भी फाड़ सकता है।" },
    { "id": "s08", "fs": 2090, "fe": 2350, "text": "इसलिए अगली बार जब छींक आए, तो उसे शान से बाहर आने दें।" },
    { "id": "s09", "fs": 2390, "fe": 2650, "text": "सब्सक्राइब करें ऐसी और जानकारी के लिए!" },
]

def main():
    from kokoro_onnx import Kokoro
    import soundfile as sf
    
    model_path = "/tmp/kokoro-v1.0.onnx"
    voices_path = "/tmp/voices-v1.0.bin"
    if not os.path.exists(model_path):
        model_path = "kokoro-v1.0.onnx"
        voices_path = "voices-v1.0.bin"

    print(f"── Generating Hindi Science Narration with Kokoro ──")
    kokoro = Kokoro(model_path, voices_path)
    
    for sc in SCENES:
        print(f"  Synthesizing {sc['id']}...")
        samples, sample_rate = kokoro.create(sc["text"], voice=VOICE_NAME, speed=SPEED, lang="hi")
        wav_path = SEG_DIR / f"{sc['id']}.wav"
        sf.write(str(wav_path), samples, sample_rate)
        subprocess.run(["ffmpeg", "-y", "-i", str(wav_path), "-codec:a", "libmp3lame", "-b:a", "192k", str(SEG_DIR / f"{sc['id']}.mp3")], check=True, capture_output=True)
        wav_path.unlink()

    total_s = TOTAL_FRAMES / FPS
    inputs, filter_parts, labels = [], [], []
    for idx, sc in enumerate(SCENES):
        seg = SEG_DIR / f"{sc['id']}.mp3"
        start_ms = int(sc["fs"] / FPS * 1000)
        inputs += ["-i", str(seg)]
        filter_parts.append(f"[{idx}]adelay={start_ms}|{start_ms}[d{idx}]")
        labels.append(f"[d{idx}]")

    fc = ";".join(filter_parts) + ";" + "".join(labels) + f"amix=inputs={len(SCENES)}:normalize=0[out]"
    subprocess.run(["ffmpeg", "-y"] + inputs + ["-filter_complex", fc, "-map", "[out]", "-t", str(total_s), "-b:a", "192k", str(AUDIO_DIR / "narration_final.mp3")], check=True)
    print("\n✅ Final Hindi Narration complete.")

if __name__ == "__main__":
    main()

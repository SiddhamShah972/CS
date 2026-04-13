from fastapi import FastAPI
import cv2
import numpy as np
import random

app = FastAPI()

def analyze_video(path):
    cap = cv2.VideoCapture(path)

    frame_count = 0
    brightness_variation = []

    while True:
        ret, frame = cap.read()
        if not ret or frame_count > 30:  # limit frames for speed
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        brightness_variation.append(brightness)

        frame_count += 1

    cap.release()

    # Simple heuristic simulation
    if len(brightness_variation) > 1:
        variation = np.std(brightness_variation)
    else:
        variation = 0

    # Simulated deepfake score
    deepfake_score = min(100, int(variation * 2 + random.randint(10, 40)))

    if deepfake_score > 70:
        verdict = "Fake"
    elif deepfake_score > 40:
        verdict = "Suspicious"
    else:
        verdict = "Real"

    return deepfake_score, verdict


@app.post("/detect")
async def detect(data: dict):
    path = data.get("path")

    score, verdict = analyze_video(path)

    return {
        "deepfake_score": score,
        "verdict": verdict
    }
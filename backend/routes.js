const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { generateHash, readMetadata, writeMetadata } = require("./utils");

const router = express.Router();
const uploadDir = path.join(__dirname, "storage", "videos");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

/**
 * 📤 Upload + Generate Provenance
 */
router.post("/upload", upload.single("video"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No video file was uploaded" });
  }

  const hash = generateHash(file.path);
  const metadata = readMetadata();

  const record = {
    video_id: uuidv4(),
    filename: file.filename,
    creator: "demo_user",
    timestamp: new Date().toISOString(),
    hash,
    edits: []
  };

  metadata.push(record);
  writeMetadata(metadata);

  res.json({
    message: "Video uploaded and signed",
    record
  });
});

/**
 * 🔍 Verify Video
 */
router.post("/verify", upload.single("video"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No video file was uploaded" });
  }

  const hash = generateHash(file.path);

  const metadata = readMetadata();

  const existing = metadata.find(m => m.hash === hash);

  if (existing) {
    return res.json({
      status: "VERIFIED",
      trust_score: 95,
      metadata: existing
    });
  }

  // ❌ Tampered or no provenance → call AI
  try {
    const aiRes = await axios.post("http://localhost:8000/detect", {
      path: file.path
    });

    return res.json({
      status: "UNVERIFIED",
      trust_score: aiRes.data.deepfake_score < 50 ? 60 : 20,
      ai_analysis: aiRes.data
    });

  } catch (err) {
    return res.status(502).json({
      status: "AI_ERROR",
      error: err.message
    });
  }
});

module.exports = router;

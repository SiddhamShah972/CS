const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "storage");
const metadataPath = path.join(storageDir, "metadata.json");

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

if (!fs.existsSync(metadataPath)) {
  fs.writeFileSync(metadataPath, "[]");
}

function generateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath);

  if (raw.length >= 2) {
    const bom = raw.readUInt16LE(0);

    if (bom === 0xfeff) {
      return raw.toString("utf16le").replace(/^\uFEFF/, "");
    }
  }

  return raw.toString("utf8").replace(/^\uFEFF/, "");
}

function readMetadata() {
  return JSON.parse(readJsonFile(metadataPath));
}

function writeMetadata(data) {
  fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { generateHash, readMetadata, writeMetadata };

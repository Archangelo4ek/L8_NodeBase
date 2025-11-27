const fs = require("fs");
const path = require("path");

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf-8");
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

module.exports = { createDir, writeFile, readFile };

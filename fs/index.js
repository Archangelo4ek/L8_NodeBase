const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const SERVICE_NAMES = new Set([
  ".git",
  ".env",
  ".gitignore",
  ".vscode",
  "node_modules",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);

function isServiceEntry(name) {
  return (
    SERVICE_NAMES.has(name) ||
    name.startsWith(".")
  );
}

function hasAllowedExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [".txt", ".json", ".rtf"].includes(ext);
}

async function writeFileAsync(filePath, content) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, content, "utf8");
}

async function readFileAsync(filePath) {
  const data = await fsp.readFile(filePath, "utf8");
  return data;
}

async function overwriteFileAsync(filePath, newContent) {
  await fsp.writeFile(filePath, newContent, "utf8");
}

async function clearFileAsync(filePath) {
  await fsp.truncate(filePath, 0);
}

async function denoiseFileAsync(filePath) {
  let data = await fsp.readFile(filePath, "utf8");
  data = data.replace(/\d+/g, "").toLowerCase();
  await fsp.writeFile(filePath, data, "utf8");
}

async function copyFileAsync(srcPath, destPath) {
  await fsp.mkdir(path.dirname(destPath), { recursive: true });
  await fsp.copyFile(srcPath, destPath);
}

async function createDirAsync(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function deleteDirAsync(dirPath) {
  await fsp.rm(dirPath, { recursive: true, force: true });
}

async function listProjectFilesAsync(rootDir = process.cwd()) {
  const result = [];
  async function walk(current) {
    const entries = await fsp.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (isServiceEntry(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        result.push(full);
      }
    }
  }
  await walk(rootDir);
  return result;
}

async function purgeProjectAsync(rootDir = process.cwd()) {
  async function walkAndDelete(current) {
    const entries = await fsp.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (isServiceEntry(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walkAndDelete(full);
        try {
          await fsp.rmdir(full);
        } catch {
        }
      } else {
        await fsp.rm(full, { force: true });
      }
    }
  }
  await walkAndDelete(rootDir);
}


function writeFileSync(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function readFileSync(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function overwriteFileSync(filePath, newContent) {
  fs.writeFileSync(filePath, newContent, "utf8");
}

function clearFileSync(filePath) {
  fs.truncateSync(filePath, 0);
}

function denoiseFileSync(filePath) {
  let data = fs.readFileSync(filePath, "utf8");
  data = data.replace(/\d+/g, "").toLowerCase();
  fs.writeFileSync(filePath, data, "utf8");
}

function copyFileSync(srcPath, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
}

function createDirSync(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function deleteDirSync(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function listProjectFilesSync(rootDir = process.cwd()) {
  const result = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (isServiceEntry(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        result.push(full);
      }
    }
  }
  walk(rootDir);
  return result;
}

function purgeProjectSync(rootDir = process.cwd()) {
  function walkAndDelete(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (isServiceEntry(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walkAndDelete(full);
        try {
          fs.rmdirSync(full);
        } catch {
          
        }
      } else {
        try {
          fs.rmSync(full, { force: true });
        } catch {
        }
      }
    }
  }
  walkAndDelete(rootDir);
}

async function demo() {
  const root = process.cwd();
  const baseDir = path.join(root, "demo");
  const fileTxt = path.join(baseDir, "note.txt");
  const fileJson = path.join(baseDir, "data.json");
  const fileRtf = path.join(baseDir, "doc.rtf");
  const copyDest = path.join(baseDir, "copy", "note_copy.txt");

  await createDirAsync(baseDir);
  await writeFileAsync(fileTxt, "Hello 123 WORLD!");
  await writeFileAsync(fileJson, JSON.stringify({ user: "Artem9", role: "ADMIN0" }, null, 2));
  await writeFileAsync(fileRtf, "{\\rtf1\\ansi This is RTF 456}");

  const read1 = await readFileAsync(fileTxt);
  console.log("Async read:", read1);

  await denoiseFileAsync(fileTxt);
  console.log("Async denoise:", await readFileAsync(fileTxt));

  await copyFileAsync(fileTxt, copyDest);
  await clearFileAsync(fileRtf); 
  await overwriteFileAsync(fileJson, '{"reset":true}');

  console.log("Async list files:", await listProjectFilesAsync(root));

  createDirSync(path.join(baseDir, "sync"));
  const syncFile = path.join(baseDir, "sync", "a.txt");
  writeFileSync(syncFile, "SYNC 999 CONTENT");
  console.log("Sync read:", readFileSync(syncFile));
  denoiseFileSync(syncFile);
  console.log("Sync denoise:", readFileSync(syncFile));

  await purgeProjectAsync(baseDir); 
  await deleteDirAsync(baseDir);   
}

if (require.main === module) {
  demo().catch(err => {
    console.error("Demo error:", err);
    process.exit(1);
  });
}

module.exports = {
  writeFileAsync,
  readFileAsync,
  overwriteFileAsync,
  clearFileAsync,
  denoiseFileAsync,
  copyFileAsync,
  createDirAsync,
  deleteDirAsync,
  listProjectFilesAsync,
  purgeProjectAsync,

  writeFileSync,
  readFileSync,
  overwriteFileSync,
  clearFileSync,
  denoiseFileSync,
  copyFileSync,
  createDirSync,
  deleteDirSync,
  listProjectFilesSync,
  purgeProjectSync
};

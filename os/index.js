require("dotenv").config();
const os = require("os");
function getOSInfo() {
  return {
    platform: os.platform(),
    freeMemory: (os.freemem() / 1024 ** 3).toFixed(2) + " GB",
    homeDir: os.homedir(),
    hostname: os.hostname(),           
    networkInterfaces: os.networkInterfaces()
  };
}

function hasEnoughMemory() {
  const freeGB = os.freemem() / 1024 ** 3;
  return freeGB > 4;
}

function showOSInfoIfAllowed() {
  const mode = process.env.MODE; // user || admin
  if (mode === "admin") {
    console.log("Доступ есть. Информация об ОС:");
    console.log(getOSInfo());
  } else {
    console.log("Доступа нет. Режим:", mode);
  }
}

console.log("Проверка памяти > 4GB:", hasEnoughMemory());
showOSInfoIfAllowed();

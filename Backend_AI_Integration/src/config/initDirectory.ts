//import makeDir from "make-dir";
const { mkdir } = require("node:fs/promises");
import path from "path";
import fs from "fs";

const publicDir = path.join("./src", "public");
const uploadsDir = path.join("./src/public", "uploads");
const audiosDir = path.join(uploadsDir, "audios");
const imagesDir = path.join(uploadsDir, "images");
const videosDir = path.join(uploadsDir, "videos");
const pdfsDir = path.join(uploadsDir, "pdfs");
const othersDir = path.join(uploadsDir, "others");
const downloadsDir = path.join("./src/public", "downloads");
const fileConfig = path.join("./src/config/config.ts");
const certDir = path.join("./src/config/cert");
const filekeysConfig = path.join("./src/config/cert/keys.json");
const filekeys_2Config = path.join("./src/config/cert/keys_2.json");

const createFile = async (filePath: string) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify({}));
    console.log(`------File ${filePath} is created------`);
  } catch (error) {
    console.error(`Error creating file: ${filePath}: `, error);
  }
};

const createDirectory = async (dirPath: string) => {
  try {
    await mkdir(dirPath);
    console.log(`------Directory ${dirPath} is created------`);
  } catch (error) {
    console.error(`Error creating directory: ${dirPath}: `, error);
  }
};

const initDirectory = async () => {
  if (!fs.existsSync(uploadsDir)) {
    await createDirectory(uploadsDir);
  }
  if (!fs.existsSync(audiosDir)) {
    await createDirectory(audiosDir);
  }
  if (!fs.existsSync(imagesDir)) {
    await createDirectory(imagesDir);
  }
  if (!fs.existsSync(videosDir)) {
    await createDirectory(videosDir);
  }
  if (!fs.existsSync(othersDir)) {
    await createDirectory(othersDir);
  }
  if (!fs.existsSync(downloadsDir)) {
    await createDirectory(downloadsDir);
  }
  if (!fs.existsSync(pdfsDir)) {
    await createDirectory(pdfsDir);
  }
  if (!fs.existsSync(filekeysConfig)) {
    await createFile(filekeysConfig);
  }
  if (!fs.existsSync(filekeys_2Config)) {
    await createFile(filekeys_2Config);
  }
  if (!fs.existsSync(fileConfig)) {
    await createFile(fileConfig);
  }
  if (!fs.existsSync(publicDir)) {
    await createDirectory(publicDir);
  }
  if (!fs.existsSync(certDir)) {
    await createDirectory(certDir);
  }
};

export default initDirectory;

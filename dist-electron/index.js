"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const { readFile, writeFile } = require("fs");
const { join, resolve } = require("path");
let mainWindow;
function assignEvents() {
  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });
  ipcMain.on("maximize", (event, arg) => {
    mainWindow.setFullScreen(arg.maximized);
  });
  ipcMain.on("close", () => {
    mainWindow.close();
    mainWindow.destroy();
  });
  ipcMain.on("setLoginWindowState", () => {
    mainWindow.setSize(720, 480);
    mainWindow.setResizable(false);
    mainWindow.center();
  });
  ipcMain.on("setHomeSizeState", () => {
    mainWindow.setSize(1e3, 720);
    mainWindow.setResizable(true);
    mainWindow.setMinimumSize(500, 600);
    mainWindow.center();
  });
}
function assignInvokeFuncs() {
  ipcMain.handle("readTempFile", (event, arg) => {
    const tempFileName = arg.tempFileName;
    return new Promise((resolve2, reject) => {
      readFile(`/data/temp/${tempFileName}`, (err, data) => {
        if (err && err.cause)
          reject(err);
        resolve2(new Blob([data.buffer]));
      });
    });
  });
  ipcMain.handle("writeTempFile", (event, arg) => {
    const tempFileName = arg.tempFileName;
    return new Promise((resolve2, reject) => {
      try {
        arg.data.arrayBuffer().then((res) => {
          writeFile(`/data/temp/${tempFileName}`, res);
          resolve2();
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1e3,
    height: 720,
    frame: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      // 预加载脚本
      contextIsolation: true,
      // 启用上下文隔离
      nodeIntegration: false
      // 禁用 Node.js 集成（安全推荐）
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:8085");
  } else {
    win.loadFile("../dist/index.html");
  }
  win.on("closed", () => mainWindow = null);
  mainWindow = win;
  assignEvents();
  assignInvokeFuncs();
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

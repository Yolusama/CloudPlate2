"use strict";
const { app, BrowserWindow } = require("electron");
const { join } = require("path");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
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
    mainWindow.loadURL("http://localhost:8085");
  } else {
    mainWindow.loadFile(join(__dirname, "../dist/index.html"));
  }
  mainWindow.on("closed", () => mainWindow = null);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

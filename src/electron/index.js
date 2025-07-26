const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');

let mainWindow;

function Size(x, y) {
  this.x = x;
  this.y = y;
}

function assignEvents() {
  ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize', (event, arg) => {
      mainWindow.setFullScreen(arg.maximized);
  });

  ipcMain.on('close', () => {
    mainWindow.close();
    mainWindow.destroy();
  });

  ipcMain.on("setLoginWindowState", () => {
    mainWindow.setSize(720, 480);
    mainWindow.setResizable(false);
    mainWindow.center();
  });

  ipcMain.on("setHomeSizeState", () => {
    mainWindow.setSize(1000,720);
    mainWindow.setResizable(true);
    mainWindow.center();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    frame: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'), // 预加载脚本
      contextIsolation: true, // 启用上下文隔离
      nodeIntegration: false, // 禁用 Node.js 集成（安全推荐）
    },
  });

  // 加载 Vite 开发的 React 页面
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8085');
    //mainWindow.webContents.openDevTools();
  } else {
    win.loadFile('../dist/index.html');
  }

  win.on('closed', () => mainWindow = null);
  mainWindow = win;
  assignEvents();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/*app.on('activate', () => {
  if (mainWindow === null) createWindow();
});*/
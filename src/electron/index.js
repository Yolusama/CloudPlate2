const { app, BrowserWindow,ipcMain } = require('electron');
const  { join } = require('path');

let mainWindow;

function assignEvents(){
 ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize', (event, arg) => {
    if (arg.maximized) {
      mainWindow.maximize();
    } else {
      mainWindow.unmaximize();
    }
  });

  ipcMain.on('close', () => {
    mainWindow.close();
  });
}

function createWindow() {
  win = new BrowserWindow({
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
    win.loadFile(join(__dirname, '../dist/index.html'));
  }
 
  win.on('closed', () => mainWindow = null);
  mainWindow = win;
  assignEvents();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
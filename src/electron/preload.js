const { contextBridge, ipcRenderer } = require('electron');
console.log(process.env)

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(event,...args));
  },
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});

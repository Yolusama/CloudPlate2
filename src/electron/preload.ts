import { contextBridge, ipcRenderer } from 'electron';
console.log(process.env)

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(event,...args));
  },
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
});

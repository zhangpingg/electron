// 1)预加载脚本
// 2)在渲染器进程加载之前加载，并有权访问渲染器全局 (window/document) 和 Node.js 环境

// contextBridge: 将接口暴露给渲染器
// ipcRenderer: 触发主进程处理程序（用于进程间通信）
const { contextBridge, ipcRenderer  } = require('electron')

// 监听：DOMContentLoaded, 渲染数据到页面上
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// 设置全局变量，供渲染器使用
contextBridge.exposeInMainWorld('versions', {   // versions: 设置一个全局变量，供渲染器使用，可以直接使用，也可以window.versions
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  fn1: () => ipcRenderer.invoke('fn1')       // 触发主进程处理程序（对应：ipcMain.handle）
})
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

const btn4 = document.getElementById('btn4');
// btn4.onclick = async function () {
//   console.log(1);
//   ipcRenderer.send('mainWindow:close')
// }
// btn4.addEventListener('click', () => {
//   ipcRenderer.send('mainWindow:close')
// })
# 打包失败
https://www.electronjs.org/zh/docs/latest/tutorial/%E6%89%93%E5%8C%85%E6%95%99%E7%A8%8B

待定
1)渲染进程 TO 主进程
ipcRenderer.send('mainWindow:close')
ipcMain.on('mainWindow:close', () => {
  mainWindow.hide()
})
2)主进程 TO 渲染进程
remindWindow.webContents.send('setTask', task)
ipcRenderer.on('setTask', (event,task) => {
   document.querySelector('.reminder').innerHTML = 
      `<span>${decodeURIComponent(task)}</span>的时间到啦！`
})

// 应用程序的入口文件（main.js脚本），该文件控制主进程，并管理渲染器进程

// app：控制应用程序的事件生命周期
// BrowserWindow：创建和管理程序的窗口
// Tray：系统拖盘
// ipcMain: 设置主进程处理程序（用于进程间通信）
// globalShortcut: 监听全局键盘事件
const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem, globalShortcut, Tray, nativeImage } = require('electron');
const path = require('path')
const fs = require('fs')
const https = require('https')

let mainWindow;   // 窗口实例
let tray;         // 托盘实例
const iconPath = path.join(__dirname, './img/icon.png')   // 图标

// 创建窗口的方法
const createWindow = () => {
  mainWindow = new BrowserWindow({  // 创建窗口
    width: 800,
    height: 600,
    icon: iconPath,                 // 应用运行时的标题栏图标
    resizable: false,               // 是否允许改变窗口大小
    // frame: false,                // 是否有chrome窗口边框（顶部工具栏，控件等）
    // titleBarStyle: 'hidden',        // chrome窗口边框的样式（注释取消，下方的样式才启作用）
    titleBarOverlay: {              // 窗口右上角的按钮
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 60
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),    // 引入预加载脚本
      backgroundThrottling: false,                    // 是否设置应用在后台正常运行
      nodeIntegration: true,                           // 是否设置能在页面使用nodejs的API
      // contextIsolation: false,                     // false:渲染器用不了预加载脚本设置的全局变量
    }
  })
  mainWindow.loadURL(path.join(__dirname, 'index.html'));    // 窗口展示的html文件（loadFile也可以）
  // mainWindow.webContents.openDevTools();                  // 打开开发工具

  // 在Electron浏览窗口上的快捷键：ctrl+i（在调度页面中的keydown和keyup事件之前，会发出before-input-event事件）
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('Pressed Control+I')
      event.preventDefault(); // 渲染器中的快捷键被拦截了
    }
  })
}

// 处理此外部协议被点击的事件
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  // 处理此外部协议被点击的事件
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })
  // 只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
  app.on('ready', () => {
    createWindow();

    ipcMain.handle('fn1', () => '触发成功');              // 主进程处理程序         
    ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      return nativeTheme.shouldUseDarkColors;
    })
    ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system';
    })
    // 托盘
    tray = new Tray(iconPath);                    // 实例化一个tray对象，构造函数的参数是托盘中需要显示的图标url  
    const menuConfig = Menu.buildFromTemplate([
      { label: '选项1' },
      { label: '退出', click: () => app.quit() },
    ])
    tray.setContextMenu(menuConfig);
    tray.setToolTip('托盘图标-悬浮时的提示信息');
    tray.on('click', () => {                      // 点击图标的响应事件，切换主窗口的显示和隐藏
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    })
    // tray.on('right-click', () => {                // 右键点击图标时，出现的菜单（和上面第一次插入的菜单有冲突，上面的优先级高）
    //   const menuConfig = Menu.buildFromTemplate([
    //     {
    //       label: '退出',
    //       click: () => app.quit(),
    //     }
    //   ])
    //   tray.popUpContextMenu(menuConfig)
    // })

    // 监听：在 macOS 系统内, 如果没有已开启的应用窗口，点击托盘图标时通常会重新创建一个新窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      };
    })
    // 监听全局键盘事件
    globalShortcut.register('Alt+Ctrl+I', () => {
      console.log('keyboard: Alt+ctrl+I');
    })
  })
}

// 监听：窗口关闭，退出应用程序（非Mac，即Windows Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

// 修改菜单（键盘快捷键）
// const menu = new Menu()
// menu.append(new MenuItem({
//   label: 'Electron',
//   submenu: [{
//     role: 'help',
//     accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',   // 加速器，即快捷键
//     click: () => { console.log('Electron rocks!') }
//   }]
// }))
// Menu.setApplicationMenu(menu)



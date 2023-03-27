// 应用程序的入口文件（main.js脚本），该文件控制主进程，并管理渲染器进程

// app：控制应用程序的事件生命周期
// BrowserWindow：创建和管理程序的窗口
// Tray：系统拖盘
// ipcMain: 设置主进程处理程序（用于进程间通信）
// globalShortcut: 监听全局键盘事件
const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem, globalShortcut, Tray } = require('electron');
const path = require('path')
const { autoUpdater } = require('electron-updater');  // 自动收到更新包的提示

let win;          // 窗口实例
let tray;         // 托盘实例
const iconPath = path.join(__dirname, './img/icon.png')   // 图标
let host = 'http://localhost:8003';                       // 窗口展示的web地址
let exeDownload = `http://192.168.1.123:7001/static`;     // 更新客户端的下载地址


// 用户正在尝试运行第二个实例
const gotTheLock = app.requestSingleInstanceLock();       // 应用实例当前是否持有单例锁(请求锁,即只能创建一个实例)
if (!gotTheLock) {
  app.quit()
} else {
  // 用户尝试运行第二个实例，我们需要让焦点指向我们的窗口
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
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
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
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

    // require('@electron/remote/main').initialize()
    // require("@electron/remote/main").enable(myWindow.webContents) //使用前需要先创建窗口实例

    // 监听：在 macOS 系统内, 如果没有已开启的应用窗口，点击托盘图标时通常会重新创建一个新窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      };
    })
    // 监听全局键盘事件
    globalShortcut.register('Ctrl+R', () => {
      win.reload();
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

// 创建窗口的方法
function createWindow() {
  win = new BrowserWindow({  // 创建窗口
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
      // contextIsolation:false,                      //上下文隔离，设置false之后可以使用require
      enableRemoteModule: true       // 启用remote功能，启用之后可以在渲染进程中使用remote
    }
  })
  win.loadURL(path.join(__dirname, 'index.html'));    // 窗口展示的html文件（loadFile也可以）
  checkUpdate();
  // 在Electron浏览窗口上的快捷键：ctrl+i（在调度页面中的keydown和keyup事件之前，会发出before-input-event事件）
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 't') {   // ctrl+T：打开开发工具
      win.webContents.openDevTools();
      event.preventDefault();                                 // 渲染器中的快捷键被拦截了
    }
  })
}
// 检查是否有可更新的版本
function checkUpdate() {
  autoUpdater.setFeedURL(exeDownload);        // 设置更新服务的地址
  autoUpdater.checkForUpdates();              // 询问服务器是否有可用更新
  autoUpdater.autoInstallOnAppQuit = false;   // 是否在应用程序退出时自动安装下载的更新
  autoUpdater.autoDownload = false;           // 发现更新后是否自动下载更新(默认true)
  autoUpdater.on('error', () => {             // 监听: 如果自动更新失败触发
    log.info(autoUpdater.getFeedURL());
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '升级服务不可用，请联系管理员',
    });
  });
  autoUpdater.on('update-available', async () => {    // 监听: 检测有可更新的应用包触发
    autoUpdater.downloadUpdate();                     // 开始手动下载更新
  });
  autoUpdater.on('update-downloaded', async () => {   // 监听: 新版本下载完成时触发
    const result = await dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1,
    });
    if (result.response === 0) {
      autoUpdater.quitAndInstall();           // 应用程序退出时自动安装下载的更新
      app.quit();
    }
  });
}
module.export = {
  "name": "electron-tuwan",
  "version": "1.0.0",
  "description": "electron 官网学习",
  "main": "main.js",                      // 应用程序的入口文件
  "scripts": {
    "start": "electron .",                // 该命令告诉 Electron 在当前目录下寻找主脚本，并以开发模式运行它
    "start:watch": "nodemon --watch index.js --exec electron ."
  },
  "author": "",
  "license": "ISC",
  build: {                        // electron-builder的配置
    appId: "xc-vone-framework",   // 包名
    productName: "统一终端",      // 项目名, 即生成的exe文件的前缀名
    copyright:"xxxx",             // 版权信息
    directories: {                // 输出文件夹
      "output": "build"
    },  
    nsis: {
      "oneClick": false, // 是否一键安装
      "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
      "allowToChangeInstallationDirectory": true  // 允许修改安装目录
    },
    win: {                        // windows相关的配置, 更改build下选项
      icon: "./icons/icons/icon.ico",
      target: [                   // 通过electron-builder的nsis直接打包成exe
        "nsis"
      ]
    },
    files: [
      "./main.js",
      "./preload.js",
      "./package.json"
    ]
  },
  "devDependencies": {
    "electron": "^23.2.0",
    "nodemon": "^2.0.21",   // 通过此依赖去监听mian.js文件，改动后，自动重启项目
  }
}

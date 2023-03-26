module.export = {
  "name": "electron-tuwan",
  "version": "1.0.0",
  "description": "electron 官网学习",
  "main": "main.js",  // 应用程序的入口文件
  "scripts": {
    "start": "electron .", // 该命令告诉 Electron 在当前目录下寻找主脚本，并以开发模式运行它
    "start:watch": "nodemon --watch index.js --exec electron ."
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^23.2.0",
    "nodemon": "^2.0.21",   // 通过此依赖去监听mian.js文件，改动后，自动重启项目
  }
}

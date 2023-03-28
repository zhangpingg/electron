import { useEffect, useState } from 'react';

const Index = () => {
  const [versionsInfo, setVersionsInfo] = useState<string>();
  const [skin, setSkin] = useState<string>('System');
  const [key, setKey] = useState<string>();

  // 2)
  const fn1 = () => {
    const { versions } = window;
    setVersionsInfo(
      `Node.js:v${versions?.node()} | Chrome:v${versions?.chrome()} | Electron:v${versions?.electron()}`,
    );
  };
  // 渲染进程调用主程序处理程序
  const fn2 = async () => {
    console.log('window', window);
    const response = await window.versions.fn1();
    alert(response);
  };
  // 换肤
  const toggleSkin = async () => {
    const res = await window.skinMode.toggle();
    setSkin(res ? 'Dark' : 'Light');
  };
  // 恢复默认肤色
  const resetSkin = async () => {
    const res = await window.skinMode.system();
    setSkin(res ? 'Dark' : 'Light');
  };

  // 监听：键盘
  const handleKeyPress = (event: any) => {
    setKey(event.key);
  };

  useEffect(() => {
    fn1();
    window.addEventListener('keyup', handleKeyPress, true);
  }, []);

  return (
    <div>
      1) 通过preload.js(预加载脚本)把Node信息渲染到页面上 <br />
      Node:<span id="node-version"></span> | Chromium:
      <span id="chrome-version"></span> | Electron:
      <span id="electron-version"></span> <br /> <br />
      2) preload.js(预加载脚本)设置全局变量, 渲染器使用全局变量,
      把Node信息渲染到页面上 <br />
      {versionsInfo} <br /> <br />
      3.1) 渲染进程调用主程序处理程序 <br />
      (1)设置主程序处理程序 <br />
      (2)preload.js(预加载脚本)触发主进程处理程序,并设置一个全局变量 <br />
      (3)渲染器调用全局变量中的属性方法 <br />
      <button onClick={fn2}>触发</button> <br /> <br />
      3.2) 肤色类型: <strong>{skin}</strong> <br />
      <button onClick={toggleSkin}>切换肤色模式</button> <br />
      <button onClick={resetSkin}>恢复系统默认肤色(System=Light)</button> <br />
      <br />
      4) preload.js(预加载脚本)/渲染器都可以设置监听键盘keyup事件 <br />
      监听键盘按下的键: {key}
    </div>
  );
};

export default Index;

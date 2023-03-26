// 渲染器：渲染数据到页面上
const versionsInfo = document.getElementById('box1');
versionsInfo.innerText = `Node.js:v${versions.node()} | Chrome:v${versions.chrome()} | Electron:v${versions.electron()}`;

// 触发主进程处理程序，即调用electron中的方法
const btn1 = document.getElementById('btn1');
btn1.onclick = async function () {
  const response = await window.versions.fn1();
  alert(response);
}
// 触发主进程处理程序
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const box2 = document.getElementById('box2');
btn2.onclick = async function () {
  const res = await window.darkMode.toggle();
  box2.innerHTML = res ? 'Dark' : 'Light';
}
btn3.onclick = async function () {
  const res = await window.darkMode.system();
  box2.innerHTML = 'System';
}

// 监听：键盘
const box3 = document.getElementById('box3');
function handleKeyPress(event) {
  box3.innerText = event.key;
}
window.addEventListener('keyup', handleKeyPress, true)

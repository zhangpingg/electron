import { Modal } from 'antd';
import { request } from 'umi';

const clientUrl = 'http://127.0.0.1:9099/'; // 本机地址

/** 接口请求->窗口大小设置 */
const postEvent = (href: string) => {
  try {
    request(href).then(
      () => {},
      (e: any) => {
        console.info('fetch error1', e);
      },
    );
  } catch (e) {
    console.info('fetch error2', e);
  }
};

/** 恢复窗口，即客户端登录页那种大小 */
const restoreWin = () => {
  postEvent(clientUrl + 'restore');
};
/** 最大化窗口 */
const maximizeWin = () => {
  postEvent(clientUrl + 'maximize');
};
/** 最小化窗口 */
const minimizeWin = () => {
  postEvent(clientUrl + 'minimize');
};
const isMaximized = () => {
  postEvent(clientUrl + 'isMaximized');
};
const isNormal = () => {
  postEvent(clientUrl + 'isNormal');
};
/** 关闭窗口 */
const closeWin = () => {
  Modal.confirm({
    title: '提示',
    content: '此操作将退出系统，是否继续？',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      localStorage.removeItem('user_token');
      postEvent(clientUrl + 'close');
    },
  });
};

export {
  maximizeWin,
  minimizeWin,
  restoreWin,
  isNormal,
  isMaximized,
  closeWin,
};

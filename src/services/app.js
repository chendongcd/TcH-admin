import Store from 'store';
import request from '../utils/request';
import config from'../utils/config'
// 用户登录
const {apiPrefix} = config
export async function signIn(params) {
  console.log('请求服务了',`${apiPrefix}/user/login`)
  return request( {
    method: 'POST',
    data: params,
    url:`${apiPrefix}/user/login`
  });
}

// 用户退出了
export async function signOut() {
  // 清除TOKEN，模拟退出
  Store.clearAll();
  return true;
}

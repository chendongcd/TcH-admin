import Store from 'store';
import {requestDev,request,config} from 'utils';
// 用户登录
const {apiPrefix,apiDev} = config
export async function signIn(params) {
  console.log('请求服务了',`${apiDev}/user/login/v1.1`)
  return request(`${apiDev}/user/login/v1.1`,{
    method: 'POST',
    body: params
  });
}

// 用户退出了
export async function signOut() {
  // 清除TOKEN，模拟退出
  Store.clearAll();
  return true;
}

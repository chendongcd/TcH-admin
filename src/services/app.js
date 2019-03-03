import {request, config} from 'utils';
// 用户登录
const { apiDev} = config

export async function signIn(params) {
  return request(`${apiDev}/user/login/v1.1`, {
    method: 'POST',
    body: params
  });
}

// 用户退出了
export async function signOut(token) {
  // 清除TOKEN，模拟退出
  return request(`${apiDev}/user/login_out/v1.1`, {
    method: 'GET',
    noMsg:true,
  },token);
}

//获取文件上传token
export async function upLoad() {
  return request(`${apiDev}/file/qiniu_auth/v1.1`, {
    method: 'GET'
  })
}

/*链接和参数*/
export function createURL(path, param) {
  let i, url = ''
  for (i in param) url += '&' + i + '=' + param[i]
  return apiDev+path + url.replace(/./, '?')
}

/*带TOKEN的导出*/
export function exportExc(path, params,token) {
  return request(apiDev+path, {
    method: 'GET',
    body: params
  },token,true);
}


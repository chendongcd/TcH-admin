import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/user`
export async function queryUserList(params) {
  console.log('请求用户列表',`${apiDev}/user/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addUser(params,token) {
  console.log('请求新增一个用户',`${apiDev}/user/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateUser(params,token) {
  console.log('请求更新用户信息',`${apiDev}/user/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryUserInfo(params) {
  console.log('请求用户信息详情',`${apiDev}/user/details/v1.1`)
  return request(`$${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}

export async function updateStatusUser(params,token) {
  console.log('请求禁用、启用用户',`${apiDev}/user/update_status/v1.1`)
  return request(`${api}/update_status/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

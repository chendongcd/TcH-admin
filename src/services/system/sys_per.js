import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/role`
export async function queryRoleList(params) {
  console.log('请求角色列表',`${apiDev}/role/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  });
}

export async function queryRoleDetail(params) {
  console.log('请求角色详情',`${apiDev}/role/list/v1.1`)
  return request(`${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRole(params,token) {
  console.log('请求新增角色',`${apiDev}/role/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRole(params,token) {
  console.log('请求更新角色',`${apiDev}/role/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRolePer(params,token) {
  console.log('请求更新角色权限',`${apiDev}/role/permissions/v1.1`)
  return request(`${api}/permissions/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

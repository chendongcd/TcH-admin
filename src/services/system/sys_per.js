import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/role`
export async function queryRoleList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryRoleDetail(params) {
  return request(`${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRole(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRole(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRolePer(params,token) {
  return request(`${api}/permissions/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/user`
export async function queryUserList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addUser(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateUser(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryUserInfo(params) {
  return request(`$${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}

export async function updateStatusUser(params,token) {
  return request(`${api}/update_status/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

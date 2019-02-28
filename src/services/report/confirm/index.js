import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/confirmation`
export async function queryConfirm(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addConfirm(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateConfirm(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryConfirmLast(params,token) {
  return request(`${api}/last/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

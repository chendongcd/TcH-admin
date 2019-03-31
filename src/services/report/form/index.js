import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/engineer_change` //http://ie8azr.natappfree.cc
export async function queryFormList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function querySum(params,token) {
  return request(`${api}/total/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryFormTableList(params,token) {
  return request(`${api}/list_statistics/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryFormSum(params,token) {
  return request(`${api}/total_statistics/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addForm(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateForm(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function del(params,token) {
  return request(`${api}/delete/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/subcontractor_resume`
export async function queryResList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function querySubList(params,token) {
  return request(`${apiDev}/subcontractor/only_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addRes(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRes(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function del(params,token) {
  return request(`${api}/deleted/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

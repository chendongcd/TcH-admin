import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/inspection`
export async function queryDownList(params,token) {
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
export async function queryDownDetail(params) {
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addDown(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateDown(params,token) {
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
export async function querySumList(params,token) {
  return request(`${api}/list_count_project/v1.1`,{
    method: 'GET',
    body: params
  },token);
}



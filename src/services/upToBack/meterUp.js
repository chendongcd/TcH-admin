import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/for_up`
export async function queryUpList(params,token) {
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

export async function queryUpDetail(params) {
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addUp(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateUp(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/loss` //http://ie8azr.natappfree.cc
export async function queryLossList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params},token);
}

export async function querySum(params,token) {
  return request(`${api}/total/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addLoss(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateLoss(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/project`


export async function addPro(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updatePro(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryProList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryProPerList(params,token) {
  return request(`${api}/permission_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryProDetail(params) {
  return request(`${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function updateProStatus(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

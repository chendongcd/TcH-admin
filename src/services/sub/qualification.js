import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/subcontractor`
export async function querySubQuaList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function querySubQuaResume(params) {
  return request(`${apiDev}/subcontractor_resume/list_for_subcontractor/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addSubQua(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateSubQua(params,token) {
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

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/file`
export async function queryReferList(params,token) {
  return request(`${api}/list_references/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryReferDetail(params) {
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRefer(params,token) {
  return request(`${api}/add_references/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRefer(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}


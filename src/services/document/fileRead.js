import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/file`
export async function queryReadList(params,token) {
  return request(`${api}/list_file/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryReadDetail(params) {
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRead(params,token) {
  return request(`${api}/add_file/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRead(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}


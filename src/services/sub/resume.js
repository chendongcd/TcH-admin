import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/subcontractor_resume`
export async function queryResList(params) {
  console.log('请求分包商履历列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  });
}

export async function querySubList(params,token) {
  console.log('请求分包商列表',`${apiDev}subcontractor/only_list/v1.1`)
  return request(`${apiDev}/subcontractor/only_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addRes(params,token) {
  console.log('请求新增分包商履历',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRes(params,token) {
  console.log('请求更新分包商履历',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/subcontractor`
export async function querySubQuaList(params,token) {
  console.log('请求分包商资质信息列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function querySubQuaResume(params) {
  console.log('请求分包商履历详情',`${apiDev}/subcontractor_resume/list_for_subcontractor/v1.1`)
  return request(`${apiDev}/subcontractor_resume/list_for_subcontractor/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addSubQua(params,token) {
  console.log('请求新增分包商资质信息',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateSubQua(params,token) {
  console.log('请求评价分包商资质信息',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

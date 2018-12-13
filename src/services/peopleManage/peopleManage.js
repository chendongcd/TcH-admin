import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/people`
export async function queryPeopleList(params,token) {
  console.log('请求管理人员列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryPeopleDetail(params) {
  console.log('请求管理人员详情',`${api}/detail_info/v1.1`)
  return request(`${api}/detail_info/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addPeople(params,token) {
  console.log('请求新增管理人员',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updatePeople(params,token) {
  console.log('请求更新管理人员',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

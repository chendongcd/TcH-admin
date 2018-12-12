import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/for_up`
export async function queryUpList(params,token) {
  console.log('请求对上计量台账列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryUpDetail(params) {
  console.log('请求项目信息卡详情',`${api}/detail/v1.1`)
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addUp(params,token) {
  console.log('请求新增项目信息卡',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateUp(params,token) {
  console.log('请求更新项目信息卡',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

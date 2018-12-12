import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/inspection`
export async function queryDownList(params,token) {
  console.log('请求对下验工计价列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryDownDetail(params) {
  console.log('请求对下验工计价详情',`${api}/detail/v1.1`)
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addDown(params,token) {
  console.log('请求新增对下验工计价',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateDown(params,token) {
  console.log('请求更新对下验工计价',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}


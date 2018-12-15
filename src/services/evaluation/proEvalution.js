import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/evaluation`
export async function queryEvaList(params,token) {
  console.log('请求项目评估列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryEvaDetail(params) {
  console.log('请求项目评估详情',`${api}/detail_info/v1.1`)
  return request(`${api}/detail_info/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addEva(params,token) {
  console.log('请求项目评估人员',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateEva(params,token) {
  console.log('请求项目评估人员',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

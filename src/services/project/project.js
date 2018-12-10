import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/project`
export async function queryProInfoList(params,token) {
  console.log('请求项目信息卡列表',`${api}/info_list/v1.1`)
  return request(`${api}/info_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryProInfoDetail(params) {
  console.log('请求项目信息卡详情',`${api}/detail_info/v1.1`)
  return request(`${api}/detail_info/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addProInfo(params,token) {
  console.log('请求新增项目信息卡',`${api}/add_info/v1.1`)
  return request(`${api}/add_info/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateProInfo(params,token) {
  console.log('请求更新项目信息卡',`${api}/update_info/v1.1`)
  return request(`${api}/update_info/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

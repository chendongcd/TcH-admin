import {request,config,requestDev} from 'utils';
import { stringify } from 'qs';

const {apiPrefix,apiDev} = config
const api = `${apiDev}/project`
export async function queryRule(params) {
  return requestDev(`${apiPrefix}/rule`,{
    method: 'GET',
    body: stringify(params)});
}

export async function removeRule(params) {
  return request( {
    method: 'POST',
    data: params,
    url:`${apiPrefix}/removeRule`
  });
}

export async function addRule(params) {
  return request( {
    method: 'POST',
    data: params,
    url:`${apiPrefix}/addRule`
  });
}

export async function updateRule(params) {
  return request( {
    method: 'POST',
    data: params,
    url:`${apiPrefix}/updateRule`
  });
}

export async function addPro(params,token) {
  console.log('请求新增项目',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updatePro(params,token) {
  console.log('请求更新项目',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryProList(params) {
  console.log('请求项目列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function queryProPerList(params) {
  console.log('请求权限内项目列表',`${api}/permission_list/v1.1`)
  return request(`${api}/permission_list/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function queryProDetail(params) {
  console.log('请求项目详情',`${api}/details/v1.1`)
  return request(`${api}/details/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function updateProStatus(params,token) {
  console.log('请求禁用、启用项目',`${api}/update_status/v1.1`)
  return request(`${api}/update_status/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

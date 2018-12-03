import {request,config} from 'utils';

const {apiDev} = config
export async function queryRoleList(params) {
  console.log('请求服务了',`${apiDev}/role/list/v1.1`)
  return request(`${apiDev}/role/list/v1.1`,{
    method: 'GET',
    body: params
  });
}

export async function queryRoleInfo(params) {
  console.log('请求服务了',`${apiDev}/role/list/v1.1`)
  return request(`${apiDev}/role/details/v1.1`,{
    method: 'GET',
    body: params
  });
}

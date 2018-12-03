import {request,config} from 'utils';

const {apiDev} = config
export async function queryUserList(params) {
  console.log('请求服务了',`${apiDev}/user/list/v1.1`)
  return request(`${apiDev}/user/list/v1.1`,{
    method: 'GET',
    body: params
  });
}

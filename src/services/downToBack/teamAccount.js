import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/team`
export async function queryTeamList(params,token) {
  console.log('请求所属对队伍列表',`${api}/list/v1.1`)
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryPerTeamList(params,token) {
  console.log('请求所属队伍列表',`${api}/only_list/v1.1`)
  return request(`${api}/only_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addTeam(params,token) {
  console.log('请求新增所属对队伍',`${api}/add/v1.1`)
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateTeam(params,token) {
  console.log('请求更新所属对队伍',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

export async function updateCompany(params,token) {
  console.log('请求公司编辑',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

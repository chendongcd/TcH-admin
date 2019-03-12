import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/team`
export async function queryTeamList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function querySum(params,token) {
  return request(`${api}/total/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryContractCodes(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function queryPerTeamList(params,token) {
  return request(`${api}/only_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function addTeam(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateTeam(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

export async function updateCompany(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function queryAmount(params,token) {
  return request(`${api}/contractor_amount/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function querySubList(params,token) {
  return request(`${api}/sub_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryTeamLists(params,token) {
  return request(`${api}/team_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

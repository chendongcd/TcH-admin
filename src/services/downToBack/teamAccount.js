import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/team`
export async function queryTeamList(params,token) {
  return request(`${api}/list/v1.1`,{
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

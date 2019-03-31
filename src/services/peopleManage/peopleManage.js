import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/people`
export async function queryPeopleList(params,token) {
  return request(`${api}/list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryPeopleDetail(params) {
  return request(`${api}/detail_info/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addPeople(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updatePeople(params,token) {
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function del(params,token) {
  return request(`${api}/deleted/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

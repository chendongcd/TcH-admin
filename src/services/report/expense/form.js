import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/contract_report` //http://ie8azr.natappfree.cc
export async function queryExpenseFormList(params,token) {
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
export async function addForm(params,token) {
  return request(`${api}/add/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateForm(params,token) {
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

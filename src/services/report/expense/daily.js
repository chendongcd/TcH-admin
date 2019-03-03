import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/contract_report` //http://ie8azr.natappfree.cc
export async function queryStatisiticsList(params,token) {
  return request(`${api}/statistics_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}
export async function querySum(params,token) {
  return request(`${api}/total_statistics/v1.1`,{
    method: 'GET',
    body: params
  },token);
}


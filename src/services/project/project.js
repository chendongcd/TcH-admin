import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/project`
export async function queryProInfoList(params,token) {
  return request(`${api}/info_list/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryProInfoDetail(params) {
  return request(`${api}/detail_info/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addProInfo(params,token) {
  return request(`${api}/add_info/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateProInfo(params,token) {
  return request(`${api}/update_info/v1.1`,{
    method: 'POST',
    body: params
  },token);
}

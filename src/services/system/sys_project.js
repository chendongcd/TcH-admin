import request from 'utils/request';
import config from'utils/config'
import { stringify } from 'qs';

const {apiPrefix} = config
export async function queryRule(params) {
  return request( {
    method: 'GET',
    data: stringify(params),
    url:`${apiPrefix}/rule`
  });
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

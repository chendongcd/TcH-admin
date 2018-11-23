import {request,config,requestDev} from 'utils';
import { stringify } from 'qs';

const {apiPrefix} = config
export async function queryRule(params) {
  return requestDev(`${apiPrefix}/rule`,{
    method: 'GET',
    body: stringify(params)});
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

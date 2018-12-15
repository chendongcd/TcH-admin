import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/file`
export async function queryReferList(params,token) {
  console.log('请求文件预览列表',`${api}/list_references/v1.1`)
  return request(`${api}/list_references/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryReferDetail(params) {
  console.log('请求对下验工计价详情',`${api}/detail/v1.1`)
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRefer(params,token) {
  console.log('请求新增文件预览',`${api}/add_references/v1.1`)
  return request(`${api}/add_references/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRefer(params,token) {
  console.log('请求更新文件预览',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}


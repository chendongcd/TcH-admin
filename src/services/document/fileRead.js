import {request,config} from 'utils';

const {apiDev} = config
const api = `${apiDev}/file`
export async function queryReadList(params,token) {
  console.log('请求文件预览列表',`${api}/list/v1.1`)
  return request(`${api}/list_file/v1.1`,{
    method: 'GET',
    body: params
  },token);
}

export async function queryReadDetail(params) {
  console.log('请求对下验工计价详情',`${api}/detail/v1.1`)
  return request(`${api}/detail/v1.1`,{
    method: 'GET',
    body: params
  });
}
export async function addRead(params,token) {
  console.log('请求新增文件预览',`${api}/add/v1.1`)
  return request(`${api}/add_file/v1.1`,{
    method: 'POST',
    body: params
  },token);
}
export async function updateRead(params,token) {
  console.log('请求更新文件预览',`${api}/update/v1.1`)
  return request(`${api}/update/v1.1`,{
    method: 'POST',
    body: params
  },token);
}


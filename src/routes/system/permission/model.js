import {queryRoleList,queryRoleDetail,addRole,updateRole,updateRolePer} from '../../../services/system/sys_per'
import {message} from 'antd';

export default {
  namespace:'sys_per',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      if(response.code=='200'){
      //  let data = {list:response.list,pagination:response.pagination}
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
      }
    },
    *queryDetail({ payload }, { call, put }) {
      const response = yield call(queryRoleDetail, payload);
      if(response.code=='200'){
        return response.entity
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      message.info('获取角色权限失败')
      return false
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },

    *addRole({ payload ,token}, { call, put }){
      const response = yield call(addRole, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('新增角色成功')
       return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *updateRole({ payload,token }, { call, put }){
      const response = yield call(updateRole, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('角色信息更新成功')
       return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *updateRolePer({ payload,token,callback }, { call, put }){
      const response = yield call(updateRolePer, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('角色权限设置成功')
        if (callback) callback();
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
}

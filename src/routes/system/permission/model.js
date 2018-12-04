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
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *queryDetail({ payload }, { call, put }) {
      const response = yield call(queryRoleDetail, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },

    *addRole({ payload ,token,callback}, { call, put }){
      const response = yield call(addRole, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('新增成功')
        if (callback) callback();
      }
    },
    *updateRole({ payload,token,callback }, { call, put }){
      const response = yield call(updateRole, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('用户信息更新成功')
        if (callback) callback();
      }
    },
    *updateRolePer({ payload,token,callback }, { call, put }){
      const response = yield call(updateRolePer, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('用户权限设置成功')
        if (callback) callback();
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

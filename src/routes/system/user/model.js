import {queryUserList,addUser,queryUserInfo,updateUser,updateStatusUser} from '../../../services/system/sys_user'
import {queryProList} from '../../../services/system/sys_project'
import {queryRoleList} from '../../../services/system/sys_per'
import {message} from 'antd'
export default {
  namespace:'sys_user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
    roleNames:[]
  },
  effects: {
    *queryUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      if(response.code=='200'){
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    *addUser({payload,token,callback,callback2},{call,put}){
      const response = yield call(addUser, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('新增用户成功')
        callback()
        callback2()
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    *updateUser({payload,token,callback,callback2},{call,put}){
      const response = yield call(updateUser, payload,token);
      if(response.code=='200'){
        message.success('用户信息修改成功')
        callback()
        callback2()
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    *queryUserInfo({payload},{call,put}){
      const response = yield call(queryUserInfo, payload);
    },
    *updateStatusUser({payload,token},{call,put}){
      const response = yield call(updateStatusUser, payload,token);
    //  console.log(response)
      if(response.code=='200'){
        message.success(`该用户已被${payload.disable == 0 ? '启用' : '禁用'}`)
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },

    *queryProNames({payload},{call,put}){
      const response = yield call(queryProList, payload);
      //console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.list
        })
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },

    *queryRoleNames({payload},{call,put}){
      const response = yield call(queryRoleList, payload);
     // console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveRoleName',
          payload:response.list
        })
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveProName(state,action){
      return{
        ...state,
        proNames:action.payload
      }
    },
    saveRoleName(state,action){
      return{
        ...state,
        roleNames:action.payload
      }
    },
  },
}

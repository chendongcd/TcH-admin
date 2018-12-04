import {queryUserList,addUser,queryUserInfo,updateUser,updateStatusUser} from '../../../services/system/sys_user'
import {queryProList} from '../../../services/system/sys_project'
import {queryRoleList} from '../../../services/system/sys_per'
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
    //  console.log(response)
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *addUser({payload,token},{call,put}){
      const response = yield call(addUser, payload,token);
    },
    *updateUser({payload,token},{call,put}){
      const response = yield call(updateUser, payload,token);
    },
    *queryUserInfo({payload},{call,put}){
      const response = yield call(queryUserInfo, payload);
    },
    *updateStatusUser({payload,token},{call,put}){
      const response = yield call(updateStatusUser, payload,token);
    },

    *queryProNames({payload},{call,put}){
      const response = yield call(queryProList, payload);
     // console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.entity
        })
      }
    },

    *queryRoleNames({payload},{call,put}){
      const response = yield call(queryRoleList, payload);
     // console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveRoleName',
          payload:response.entity
        })
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

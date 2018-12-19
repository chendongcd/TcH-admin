import {updateUp,addUp,queryUpDetail,queryUpList} from '../../../services/upToBack/meterUp';
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";
export default {
  namespace: 'meterUp',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryUpList, payload,token);
      console.log(response)
      if(response.code == '200'){
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
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryUpDetail, payload);
      if (callback) callback();
    },
    *add({ payload}, { call, put }) {
      const response = yield call(addUp, payload);
      if(response.code=='200'){
        message.success('新增成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *update({ payload}, { call, put }) {
      const response = yield call(updateUp, payload);
      if(response.code=='200'){
        message.success('修改成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *queryProNames({payload,token},{call,put}){
      const response = yield call(queryProPerList, payload,token);
      console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.entity
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
  },

};

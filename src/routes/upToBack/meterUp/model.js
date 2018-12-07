import {updateUp,addUp,queryUpDetail,queryUpList} from '../../../services/upToBack/meterUp';
import {queryProList} from "../../../services/system/sys_project";
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
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUpList, payload);
      console.log(response)
      if(response.code == '200'){
        yield put({
          type: 'save',
          payload: response,
        });
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
      return false
    },
    *update({ payload}, { call, put }) {
      const response = yield call(updateUp, payload);
      if(response.code=='200'){
        message.success('修改成功');
        return true
      }
      return false
    },
    *queryProNames({payload},{call,put}){
      const response = yield call(queryProList, payload);
      console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.list
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
  },

};

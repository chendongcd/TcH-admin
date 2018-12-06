import {queryProInfoList,queryProInfoDetail,addProInfo,updateProInfo} from '../../../services/project/project'
import {queryProList} from "../../../services/system/sys_project";
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {
  namespace: 'pro_proInfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload}, { call, put }) {
      const response = yield call(queryProInfoList, payload);
      console.log(payload)
      if(response.code == '200'){
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload,token, callback }, { call, put }) {
      const response = yield call(addProInfo, payload,token);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryProInfoDetail, payload);
      if (callback) callback();
    },
    *update({ payload, token,callback }, { call, put }) {
      const response = yield call(updateProInfo, payload,token);
      if (callback) callback();
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

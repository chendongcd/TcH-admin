import {addSubQua,querySubQuaList} from '../../../services/sub/qualification'
import {queryProList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";
export default {
  namespace: 'sub_qua',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySubQuaList, payload);
      if(response.code=='200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addSubQua, payload);
      if(response.code=='200'){
        message.success('新增成功');
        return true
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
    },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
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

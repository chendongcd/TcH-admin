import {addSubQua,querySubQuaList,updateSubQua} from '../../../services/sub/qualification'
import {queryProList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";
export default {
  namespace: 'sub_qua',

  state: {
    data: {
      list: [],
      pagination: {},
    }},

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
    *update({ payload }, { call, put }) {
      const response = yield call(updateSubQua, payload);
      if(response.code=='200'){
        return true
      }
      return false
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    }
  },

};

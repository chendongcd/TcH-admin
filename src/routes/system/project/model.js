import {addPro,updatePro,queryProDetail,queryProList,queryRule} from '../../../services/system/sys_project'
import {message} from "antd/lib/index";
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {
  namespace: 'sys_pro',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *addPro({ payload, token,callback }, { call, put }) {
      const response = yield call(addPro, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('新增成功');
        if (callback) callback();
      }
    },
    *updatePro({ payload, token,callback }, { call, put }) {
      const response = yield call(updatePro, payload,token);
      console.log(response)
      if(response.code=='200'){
        message.success('修改成功');
        if (callback) callback();
      }
    },
    *queryProList({ payload }, { call, put }) {
      const response = yield call(queryProList, payload);
      console.log(response)
    },
    *queryProDetail({ payload }, { call, put }) {
      const response = yield call(queryProDetail, payload);
      console.log(response)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },

};

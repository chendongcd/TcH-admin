import {addPro, updatePro, queryProDetail, queryProList, queryRule,updateProStatus} from '../../../services/system/sys_project'
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
    * fetch({payload}, {call, put}) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * addPro({payload, token, callback, callback2}, {call, put}) {
      const response = yield call(addPro, payload, token);
      console.log(response)
      if (response.code == '200') {
        message.success('新增成功');
        callback();
        callback2();
      }
    },
    * updatePro({payload, token, callback, callback2}, {call, put}) {
      const response = yield call(updatePro, payload, token);
      console.log(response)
      if (response.code == '200') {
        message.success('修改成功');
        callback();
        callback2();
      }
    },
    * queryProList({payload}, {call, put}) {
      const response = yield call(queryProList, payload);
      console.log(response)
      if (response.code == '200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * queryProDetail({payload}, {call, put}) {
      const response = yield call(queryProDetail, payload);
      console.log(response)
    },
    * updateProStatus({payload, token}, {call, put}) {
      const response = yield call(updateProStatus, payload, token);
      console.log(response)
      if (response.code == '200') {
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
    },
  },

};

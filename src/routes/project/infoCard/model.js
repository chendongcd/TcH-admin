import {queryProInfoList,queryProInfoDetail,addProInfo,updateProInfo} from '../../../services/project/project'
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {
  namespace: 'pro_proInfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload}, { call, put }) {
      const response = yield call(queryProInfoList, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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

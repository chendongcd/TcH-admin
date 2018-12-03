import {queryRoleList,queryRoleInfo} from '../../../services/system/sys_per'

export default {
  namespace:'sys_per',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryRoleInfo, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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
}

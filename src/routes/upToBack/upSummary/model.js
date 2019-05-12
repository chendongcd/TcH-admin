import {querySumList} from '../../../services/upToBack/meterUp';

export default {
  namespace: 'upSummary',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(querySumList, payload, token);
      if (response.code == '200') {
        if (response.list.length > 0) {
          response.list = global.calcuIndex(response)
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
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
  },

};

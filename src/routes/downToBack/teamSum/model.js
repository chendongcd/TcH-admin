import {querySumList} from '../../../services/downToBack/teamAccount'

export default {
  namespace: 'teamSum',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
    subNames: [],
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(querySumList, payload, token);
      if (response.code == '200') {
        if(response.list.length>0){
          response.list = global.calcuIndex(response)
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (response.code == '401') {
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

import {querySumList} from "../../../services/downToBack/meterDown";

export default {
  namespace: 'meterSum',

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
        if(response.list.length>0){
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
    saveProName(state, action) {
      return {
        ...state,
        proNames: action.payload
      }
    },
    saveSubName(state, action) {
      return {
        ...state,
        subNames: action.payload
      }
    },
    saveTeamList(state,action){
      return {
        ...state,
        teamList: action.payload
      }
    }
  },

};

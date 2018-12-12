import {queryTeamList, addTeam, updateCompany, updateTeam} from '../../../services/downToBack/teamAccount'

export default {
  namespace: 'teamAccount',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryTeamList, payload, token);
      console.log(response)
      if(response.code=='200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      return false
    },
    * updateCompany({payload, token}, {call, put}) {
      const response = yield call(updateCompany, payload, token);
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

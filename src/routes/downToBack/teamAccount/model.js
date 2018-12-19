import {queryTeamList, addTeam, updateCompany, updateTeam} from '../../../services/downToBack/teamAccount'
import { queryProPerList} from "../../../services/system/sys_project";
import {querySubList} from "../../../services/sub/resume";

export default {
  namespace: 'teamAccount',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
    subNames: [],
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
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * updateCompany({payload, token}, {call, put}) {
      const response = yield call(updateCompany, payload, token);
      if (response.code == '200') {

        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *queryProNames({payload,token},{call,put}){
      const response = yield call(queryProPerList, payload,token);
      console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.entity
        })
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    * querySubNames({payload, token}, {call, put}) {
      const response = yield call(querySubList, payload, token);
      console.log(response)
      if (response.code == '200') {
        yield put({
          type: 'saveSubName',
          payload: response.entity
        })
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
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
    saveProName(state,action){
      return{
        ...state,
        proNames:action.payload
      }
    },
    saveSubName(state, action) {
      return {
        ...state,
        subNames: action.payload
      }
    },
  },

};

import {addDown, queryDownList, updateDown} from "../../../services/downToBack/meterDown";
import {queryProPerList} from "../../../services/system/sys_project";
export default {
  namespace: 'meterDown',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryDownList, payload, token);
      console.log(response)
      if(response.code=='200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addDown, payload, token);
      if (response.code == '200') {

        return true
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateDown, payload, token);
      if (response.code == '200') {

        return true
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
  },

};

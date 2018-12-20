import {addDown, queryDownList, updateDown} from "../../../services/downToBack/meterDown";
import {queryProPerList} from "../../../services/system/sys_project";
import {querySubList} from "../../../services/sub/resume";
export default {
  namespace: 'meterDown',

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
      const response = yield call(queryDownList, payload, token);
      console.log(response)
      if(response.code=='200') {
        if(response.list.length>0) {
          let x = 0, y = 0, z = 0
          response.list.forEach(a => {
            x += a.valuationPrice
            y += a.endedPrice
          })

          z = Math.floor(x / (x + y) * 100) / 100
          let sum = {id: 'sum', underRate: z, code: '合计:'}
          response.list = [...response.list, sum]
        }
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
      const response = yield call(addDown, payload, token);
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
      const response = yield call(updateDown, payload, token);
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

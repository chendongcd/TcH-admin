import {queryEvaList,addEva,updateEva} from '../../../services/evaluation/proEvalution'
import {queryProPerList} from "../../../services/system/sys_project";
export default {
  namespace: 'proEvaluate',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload,token }, { call, put }) {
      const response = yield call(queryEvaList, payload,token);
      console.log(response)
      if(response.code=='200') {
        yield put({
          type: 'save',
          payload: response,
        });
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *add({ payload, token }, { call, put }) {
      const response = yield call(addEva, payload,token);
      if(response.code=='200') {
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *update({ payload, token }, { call, put }) {
      const response = yield call(updateEva, payload,token);
      if(response.code=='200') {
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

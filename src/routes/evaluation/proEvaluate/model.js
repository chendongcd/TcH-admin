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
      if(response.code=='200') {
        response.list = global.calcuIndex(response)
        yield put({
          type: 'save',
          payload: response,
        });
        return true
      }
      if(global.checkToken(response)){
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
      if(global.checkToken(response)){
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
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *queryProNames({payload,token},{call,put}){
      const response = yield call(queryProPerList, payload,token);
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload: response.entity?response.entity:[]
        })
      }
      if(global.checkToken(response)){
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

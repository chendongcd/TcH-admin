import {queryProPerList} from "../../../services/system/sys_project";
import {queryConfirm,queryConfirmLast,addConfirm,updateConfirm,querySum} from '../../../services/report/confirm/index'
import {message} from "antd";
export default {
  namespace: 'confirmation',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
    lastOver:{}
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryConfirm, payload,token);
      if(response.code == '200'){
        if(response.list.length>0){
          if(global._getTotalPage(response.pagination.total)===response.pagination.current){
            yield put({
              type:'fetchSum',
              payload:payload,
              token:token,
              list:response.list.length
            })
          }
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
    },
    * fetchSum({payload, token,list}, {call, put,select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.confirmation.data))
        let sum = {
          id: '合计:',
          balanceChange: response.entity.sumBalanceChange,
          balanceCompleteValue: response.entity.sumBalanceCompleteValue,
          balanceInspectionValue: response.entity.sumBalanceInspectionValue,
          balanceShould: response.entity.sumBalanceShould,
          changeValue: response.entity.sumChangeValue,
          completedValue: response.entity.sumCompletedValue,
          currentProductionValue: response.entity.sumCurrentProductionValue,
          finalPeriodChange: response.entity.sumFinalPeriodChange,
          finalPeriodShould: response.entity.sumFinalPeriodShould,
          halfCompletedValue: response.entity.sumHalfCompletedValue,
          inspection: response.entity.sumInspection,
          oneCompletedValue: response.entity.sumOneCompletedValue,
          sumBalance:response.entity. sumSumBalance,
          sumFinalPeriod: response.entity.sumSumFinalPeriod,
          sumHalfOne: response.entity.sumSumHalfOne
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])){
            sum[a] = Number.isInteger(Number(sum[a]))?Number(sum[a]):Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list,sum]
        if(list===10) {
          data.pagination.pageSize = data.pagination.pageSize + 1
        }
          yield put({
            type: 'save',
            payload: data,
          });
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    *add({ payload,token}, { call, put }) {
      const response = yield call(addConfirm, payload,token);
      if(response.code=='200'){
        message.success('新增成功');
        return true
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *update({ payload,token}, { call, put }) {
      const response = yield call(updateConfirm, payload,token);
      if(response.code=='200'){
        message.success('修改成功');
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
    *queryLast({payload,token},{call,put}){
      const response = yield call(queryConfirmLast, payload,token);
      if(response.code=='200'){
        return response.entity
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
    saveLastOver(state,action){
      return{
        ...state,
        lastOver:action.payload
      }
    }
  },

};

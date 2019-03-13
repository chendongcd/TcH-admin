import {queryExpenseFormList,addForm,updateForm,querySum} from '../../../../services/report/expense/form';
import {queryProPerList} from "../../../../services/system/sys_project";
import {queryTeamLists,querySubList} from "../../../../services/downToBack/teamAccount"
import {message} from "antd";
export default {
  namespace: 'expenseForm',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
    subNames: [],
    teamList:[],
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryExpenseFormList, payload,token);
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
        const data = yield (select(_ => _.expenseForm.data))
        let sum = {
          id: '合计:',
          totalAmountContract: response.entity.sumTotalAmountContract,
          mechanicalClass: response.entity.sumMechanicalClass,
          sporadicEmployment: response.entity.sumSporadicEmployment,
          dailyWorkSubtotal: response.entity.sumDailyWorkSubtotal,
          outIn: response.entity.sumOutIn,
          disasterDamage: response.entity.sumDisasterDamage,
          workStop: response.entity.sumWorkStop,
          other: response.entity.sumOther,
          compensationSubtotal: response.entity.sumCompensationSubtotal,
          total: response.entity.sumTotal,
          dailyPercentage: response.entity.sumDailyPercentage/100,
          compensationPercentage: response.entity.sumCompensationPercentage/100,
          amountAlreadyDisbursed: response.entity.sumAmountAlreadyDisbursed,
          disbursedPercentage: response.entity.sumDisbursedPercentage/100,
          estimateMechanicalClass: response.entity.sumEstimateMechanicalClass,
          estimateSporadicEmployment: response.entity.sumEstimateSporadicEmployment,
          estimateDailyWorkSubtotal: response.entity.sumEstimateDailyWorkSubtotal,
          estimateOutIn: response.entity.sumEstimateOutIn,
          estimateDisasterDamage: response.entity.sumEstimateDisasterDamage,
          estimateWorkStop: response.entity.sumEstimateWorkStop,
          estimateOther: response.entity.sumEstimateOther,
          estimateCompensationSubtotal: response.entity.sumEstimateCompensationSubtotal,
          estimateTotal: response.entity.sumEstimateTotal
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])&&a!=='disbursedPercentage'&&a!=='compensationPercentage'&&a!=='dailyPercentage'){
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
      const response = yield call(addForm, payload,token);
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
      const response = yield call(updateForm, payload,token);
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
    * querySubNames({payload, token}, {call, put}) {
      const response = yield call(querySubList, payload, token);
      if (response.code == '200') {
        if(response.entity&&response.entity.length==0){
          message.warning('该项目还没有所属分包商')
        }
        yield put({
          type: 'saveSubName',
          payload: response.entity
        })
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * queryTeams({payload, token}, {call, put}) {
      const response = yield call(queryTeamLists, payload, token);
      if (response.code == '200') {
        if(response.entity&&response.entity.length==0){
          message.warning('该项目和分包商还没有所属队伍')
        }
        yield put({
          type: 'saveTeamList',
          payload: response.entity
        })
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
    saveTeamList(state,action){
      return {
        ...state,
        teamList: action.payload
      }
    }
  },

};

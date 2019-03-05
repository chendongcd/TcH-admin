import {queryStatisiticsList,querySum} from '../../../../services/report/expense/daily';
export default {
  namespace: 'expenseDaily',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryStatisiticsList, payload,token);
      if(response.code == '200'){
        if(response.list.length>0){
          if(global._getTotalPage(response.pagination.total)===response.pagination.current){
            yield put({
              type:'fetchSum',
              payload:payload,
              token:token
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
    * fetchSum({payload, token}, {call, put,select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.expenseDaily.data))
        let sum = {
          projectName: '合计:',
          statisticsTotalAmountContract:response.entity.sumStatisticsTotalAmountContract,
          statisticsDailyWorkSubtotal:response.entity.sumStatisticsDailyWorkSubtotal,
          statisticsCompensationSubtotal:response.entity.sumStatisticsCompensationSubtotal,
          statisticsAlreadySubtotal:response.entity.sumStatisticsAlreadySubtotal,
          statisticsEstimateDailyWorkSubtotal:response.entity.sumStatisticsEstimateDailyWorkSubtotal,
          statisticsEstimateCompensationSubtotal:response.entity.sumStatisticsEstimateCompensationSubtotal,
          statisticsEstimateSubtotal:response.entity.sumStatisticsEstimateSubtotal
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])){
            sum[a] = Number.isInteger(Number(sum[a]))?Number(sum[a]):Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list,sum]
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

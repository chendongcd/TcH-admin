import {queryStatisiticsList} from '../../../../services/report/expense/daily';
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
        let a3 = 0,a4 = 0,a5 = 0,a6 = 0,a7 = 0,a8 = 0,a9 = 0
        response.list.forEach(a => {
          a3 += a.statisticsTotalAmountContract
          a4+=a.statisticsDailyWorkSubtotal
          a5+=a.statisticsCompensationSubtotal
          a6+= a.statisticsAlreadySubtotal
          a7+=a.statisticsEstimateDailyWorkSubtotal
          a8+=a.statisticsEstimateCompensationSubtotal
          a9+=a.statisticsEstimateSubtotal
        })
        let sum = {
          id: '合计:',
          statisticsTotalAmountContract:a3.toFixed(2),
          statisticsDailyWorkSubtotal:a4.toFixed(2),
          statisticsCompensationSubtotal:a5.toFixed(2),
          statisticsAlreadySubtotal:a6.toFixed(2),
          statisticsEstimateDailyWorkSubtotal:a7.toFixed(2),
          statisticsEstimateCompensationSubtotal:a8.toFixed(2),
          statisticsEstimateSubtotal:a9.toFixed(2)
        }
        response.list = [...response.list, sum]
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
    }
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

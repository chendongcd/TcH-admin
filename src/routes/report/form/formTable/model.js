import {queryFormTableList, queryFormSum} from '../../../../services/report/form';
export default {
  namespace: 'reportFormTable',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryFormTableList, payload,token);
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
      const response = yield call(queryFormSum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.reportFormTable.data))
        let sum = {
          projectName: '合计:',
          temporarilyPriceStatistics: response.entity.sumTemporarilyPrice,
          constructionOutputValueStatistics: response.entity.sumConstructionOutputValue,
          changeClaimAmountStatistics: response.entity.sumChangeClaimAmount,
          percentageStatistics: response.entity.sumPercentage/100,
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])&&a!=='percentageStatistics'){
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

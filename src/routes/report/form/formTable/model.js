import {queryFormTableList} from '../../../../services/report/form';
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
        let a4 = 0, a5 = 0,a6 = 0,a7 = 0
        response.list.forEach(a => {
          a4+=a.temporarilyPriceStatistics
          a5+=a.constructionOutputValueStatistics
          a6+= a.changeClaimAmountStatistics
        })
        a7 =a4===0?0:((a6/a4)*100).toFixed(2)
        let sum = {
          id: '合计:',
          temporarilyPriceStatistics:isNaN(a4)?'':a4.toFixed(0),
          constructionOutputValueStatistics:isNaN(a5)?'':a5.toFixed(0),
          changeClaimAmountStatistics:isNaN(a6)?'':a6.toFixed(0),
          changeClaimAmount:isNaN(a7)?'':a7,
        }
        response.list = [...response.list]
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

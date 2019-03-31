import {queryLossList, addLoss, updateLoss, querySum, del} from '../../../services/report/loss/loss';
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd";

export default {
  namespace: 'lossForm',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: []
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryLossList, payload, token);
      if (response.code == '200') {
        if (response.list.length > 0) {
          response.list = global.calcuIndex(response)
          if (global._getTotalPage(response.pagination.total) === response.pagination.current) {
            yield put({
              type: 'fetchSum',
              payload: payload,
              token: token,
              list: response.list.length
            })
          }
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * fetchSum({payload, token, list}, {call, put, select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.lossForm.data))
        let sum = {
          ids: '合计:',
          alreadyPriced: response.entity.sumAlreadyPriced,
          confirmPriced: response.entity.sumConfirmPriced,
          confirmedNetProfit: response.entity.sumConfirmedNetProfit,
          inBookCost: response.entity.sumInBookCost,
          lossAmount: response.entity.sumLossAmount,
          lossRatio: response.entity.sumLossRatio,
          outBookCost: response.entity.sumOutBookCost,
          potentialLoss: response.entity.sumPotentialLoss,
          profitLossSubtotal: response.entity.sumProfitLossSubtotal,
          sumBookCost: response.entity.sumSumBookCost,
          sumPriced: response.entity.sumSumPriced,
          temporarilyPrice: response.entity.sumTemporarilyPrice,
          totalProfitLoss: response.entity.sumTotalProfitLoss,
          unConfirmedNetProfit: response.entity.sumUnConfirmedNetProfit,
          unPriced: response.entity.sumUnPriced
        }
        for (let a in sum) {
          if (sum[a] && !isNaN(sum[a])) {
            sum[a] = Number.isInteger(Number(sum[a])) ? Number(sum[a]) : Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list, sum]
        if (list === 10) {
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
    * add({payload, token}, {call, put}) {
      const response = yield call(addLoss, payload, token);
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateLoss, payload, token);
      if (response.code == '200') {
        message.success('修改成功');
        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * queryProNames({payload, token}, {call, put}) {
      const response = yield call(queryProPerList, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveProName',
          payload: response.entity ? response.entity : []
        })
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * del({payload, token}, {call, put}) {
      const response = yield call(del, payload, token);
      if (response.code == '200') {
        message.success('删除成功');
        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveProName(state, action) {
      return {
        ...state,
        proNames: action.payload
      }
    }
  },

};

import {updateUp, addUp, queryUpDetail, queryUpList, querySum} from '../../../services/upToBack/meterUp';
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd";

export default {
  namespace: 'meterUp',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryUpList, payload, token);
      if (response.code == '200') {
        if (response.list.length > 0) {
          if (response.pagination.total===0||(global._getTotalPage(response.pagination.total) === response.pagination.current)) {
            yield put({
              type: 'fetchSum',
              payload: payload,
              token: token
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
    * fetchSum({payload, token}, {call, put, select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.meterUp.data))
        let sum = {
          payProportion: response.entity.percentagePayProportion/100,
          productionValue: response.entity.percentageProductionValue/100,
          id: '合计:',
          prepaymentAmount: response.entity.sumPrepaymentAmount,
          valuationAmountTax: response.entity.sumTaxAmount,
          valuationAmountNotTax: response.entity.sumAmountNotTax,
          realAmountTax: response.entity.sumRealTaxAmount,
          realAmount: response.entity.sumRealAmount,
          alreadyPaidAmount: response.entity.sumAlreadyAmount,
          unpaidAmount: response.entity.sumUnpaidAmount,
          notCalculatedAmount: response.entity.sumEndAmount,
          extraAmount: response.entity.sumExtraAmount
        }
        for (let a in sum) {
          if (sum[a] && !isNaN(sum[a]) && a !== 'payProportion'&& a !== 'productionValue') {
            sum[a] = Number.isInteger(Number(sum[a])) ? Number(sum[a]) : Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list, sum]
        data.pagination.pageSize = data.pagination.pageSize+1
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

    * fetchDetail({payload, callback}, {call, put}) {
      yield call(queryUpDetail, payload);
      if (callback) callback();
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addUp, payload, token);
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
      const response = yield call(updateUp, payload, token);
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
    },
  },

};

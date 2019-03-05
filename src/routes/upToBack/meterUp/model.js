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
        /*         let x = 0, y = 0, z = 0, a5 = 0, a14 = 0, a13 = 0, a15 = 0
                 let aPre = 0,a7=0,a8=0,a9=0,a10=0,a11=0
                 response.list.forEach(a => {
                   x += a.realAmountTax//8
                   y += a.alreadyPaidAmount//10
                   a5 += a.valuationAmountTax
                   a14 += a.notCalculatedAmount
                   a13 += a.extraAmount
                   aPre+=a.prepaymentAmount
                   a7=(a7+a.valuationAmountNotTax*100)
                   a8+=a.realAmountTax
                   a9+=a.realAmount
                   a10+=a.alreadyPaidAmount
                   a11+=a.unpaidAmount
                 })
                 z = x==0?0:(y / x).toFixed(4)
                 a15 = (a5 + a14 + a13)==0?0:(a5 / (a5 + a14 + a13)).toFixed(4)
                 let sum = {
                   payProportion: z,
                   productionValue: a15,
                   id: '合计:',
                   prepaymentAmount:aPre,
                   valuationAmountTax:a5,
                   valuationAmountNotTax:(a7/100).toFixed(2),
                   realAmountTax:a8,
                   realAmount:a9,
                   alreadyPaidAmount:a10,
                   unpaidAmount:a11,
                   notCalculatedAmount:a14,
                   extraAmount:a13
                 }
                 response.list = [...response.list]*/
        if (response.list.length > 0) {
          if (global._getTotalPage(response.pagination.total) === response.pagination.current) {
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
        console.log(response.entity)
        let sum = {
          payProportion: response.entity.percentagePayProportion/100,
          productionValue: response.entity.percentageProductionValue/100,
          id: '合计:',
          prepaymentAmount: response.entity.sumPrepaymentAmount,
          valuationAmountTax: response.entity.sumTaxAmount,
          valuationAmountNotTax: response.entity.sumAmountNotTax,
          realAmountTax: response.entity.sumRealAmountTax,
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

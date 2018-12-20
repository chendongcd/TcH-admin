import {updateUp,addUp,queryUpDetail,queryUpList} from '../../../services/upToBack/meterUp';
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";
export default {
  namespace: 'meterUp',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryUpList, payload,token);
     // console.log(response)
      if(response.code == '200'){
        if(response.code=='200') {
          let x = 0, y = 0, z = 0, a5 = 0, a14 = 0, a13 = 0, a15 = 0
          response.list.forEach(a => {
            x += a.realAmountTax//8
            y += a.alreadyPaidAmount//10
            a5 += a.valuationAmountTax
            a14 += a.notCalculatedAmount
            a13 += a.extraAmount
          })

          z = Math.floor(y / x * 100) / 100
          a15 = Math.floor(a5 / (a5 + a14 + a13) * 100) / 100
          let sum = {id: 'sum', payProportion: z, productionValue: a15, code: '合计:'}
          response.list = [...response.list, sum]
        }
        //console.log(response)
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryUpDetail, payload);
      if (callback) callback();
    },
    *add({ payload}, { call, put }) {
      const response = yield call(addUp, payload);
      if(response.code=='200'){
        message.success('新增成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *update({ payload}, { call, put }) {
      const response = yield call(updateUp, payload);
      if(response.code=='200'){
        message.success('修改成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    *queryProNames({payload,token},{call,put}){
      const response = yield call(queryProPerList, payload,token);
      console.log(response)
      if(response.code=='200'){
        yield put({
          type:'saveProName',
          payload:response.entity
        })
      }
      if(response.code=='401'){
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

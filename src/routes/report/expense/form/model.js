import {queryExpenseFormList,addForm,updateForm} from '../../../../services/report/expense/form';
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
        // let x = 0, y = 0, z = 0, a5 = 0, a14 = 0, a13 = 0, a15 = 0
        // let aPre = 0,a7=0,a8=0,a9=0,a10=0,a11=0
        // response.list.forEach(a => {
        //   x += a.realAmountTax//8
        //   y += a.alreadyPaidAmount//10
        //   a5 += a.valuationAmountTax
        //   a14 += a.notCalculatedAmount
        //   a13 += a.extraAmount
        //   aPre+=a.prepaymentAmount
        //   a7=(a7+a.valuationAmountNotTax*100)
        //   a8+=a.realAmountTax
        //   a9+=a.realAmount
        //   a10+=a.alreadyPaidAmount
        //   a11+=a.unpaidAmount
        // })
        // z = x==0?0:(y / x).toFixed(4)
        // a15 = (a5 + a14 + a13)==0?0:(a5 / (a5 + a14 + a13)).toFixed(4)
        // let sum = {
        //   payProportion: z,
        //   productionValue: a15,
        //   id: '合计:',
        //   prepaymentAmount:aPre,
        //   valuationAmountTax:a5,
        //   valuationAmountNotTax:(a7/100).toFixed(2),
        //   realAmountTax:a8,
        //   realAmount:a9,
        //   alreadyPaidAmount:a10,
        //   unpaidAmount:a11,
        //   notCalculatedAmount:a14,
        //   extraAmount:a13
        // }
        // response.list = [...response.list, sum]
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

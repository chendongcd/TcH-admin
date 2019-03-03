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
        // let a8=0,a9=0,a10=0,a11=0,a12=0,a13=0,a14=0,a15=0,a16=0,a17=0,a18=0,a19=0,a20=0,a21=0
        // let a24 = 0,a25 = 0,a26 = 0,a27 = 0,a28 = 0,a29 = 0,a30 = 0,a31 = 0,a32=0
        // response.list.forEach(a => {
        //   a8 += a.totalAmountContract
        //   a9+=a.mechanicalClass
        //   a10+=a.sporadicEmployment
        //   a11+= a.dailyWorkSubtotal
        //   a12+=a.outIn
        //   a13+=a.disasterDamage
        //   a14+=a.workStop
        //   a15+=a.other
        //   a16+=a.compensationSubtotal
        //   a17+=a.total
        //   a20+=a.amountAlreadyDisbursed
        //   a24+=a.estimateMechanicalClass
        //   a25+=a.estimateSporadicEmployment
        //   a26+=a.estimateDailyWorkSubtotal
        //   a27+=a.estimateOutIn
        //   a28+=a.estimateDisasterDamage
        //   a29+=a.estimateWorkStop
        //   a30+=a.estimateOther
        //   a31+=a.estimateCompensationSubtotal
        //   a32+=a.estimateTotal
        // })
        // a18 = a17===0?0:((a11/a17*100).toFixed(2))
        // a19 = a17===0?0:(a16/a17*100).toFixed(2)
        // a21 = (a16+a11)===0?0:(a20/(a16+a11)*100).toFixed(2)
        // let sum = {
        //   id: '合计:',
        //   totalAmountContract:a8,
        //   mechanicalClass:a9,
        //   sporadicEmployment:a10,
        //   dailyWorkSubtotal:a11,
        //   outIn:a12,
        //   disasterDamage:a13,
        //   workStop:a14,
        //   other:a15,
        //   compensationSubtotal:a16,
        //   total:a17.toFixed(2),
        //   dailyPercentage:a18,
        //   compensationPercentage:a19,
        //   amountAlreadyDisbursed:a20,
        //   disbursedPercentage:a21,
        //   estimateMechanicalClass:a24,
        //   estimateSporadicEmployment:a25,
        //   estimateDailyWorkSubtotal:a26,
        //   estimateOutIn:a27,
        //   estimateDisasterDamage:a28,
        //   estimateWorkStop:a29,
        //   estimateOther:a30,
        //   estimateCompensationSubtotal:a31,
        //   estimateTotal:a32
        // }
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

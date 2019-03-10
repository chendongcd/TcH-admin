import {queryFormList,addForm,updateForm,querySum} from '../../../../services/report/form';
import {queryProPerList} from "../../../../services/system/sys_project";
import {message} from "antd";
export default {
  namespace: 'reportForm',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames:[],
  },

  effects: {
    *fetch({ payload ,token}, { call, put }) {
      const response = yield call(queryFormList, payload,token);
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
        const data = yield (select(_ => _.reportForm.data))
        let sum = {
          id: '合计:',
          temporarilyPrice: response.entity.sumTemporarilyPrice,
          constructionOutputValue: response.entity.sumConstructionOutputValue,
          changeClaimAmount: response.entity.sumChangeClaimAmount,
          percentage: response.entity.sumPercentage/100,
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])&&a!=='percentage'){
            sum[a] = Number.isInteger(Number(sum[a]))?Number(sum[a]):Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list,sum]
        data.pagination.pageSize = data.pagination.pageSize+1,
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

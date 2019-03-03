import {queryFormList,addForm,updateForm} from '../../../../services/report/form';
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
        let a5 = 0,a6 = 0,a7 = 0,a8 = 0
        response.list.forEach(a => {
          a5+=a.temporarilyPrice
          a6+= a.constructionOutputValue
          a7+=a.changeClaimAmount
        })
        a8 =a5===0?0:((a7/a5)*100).toFixed(2)
        let sum = {
          id: '合计:',
          temporarilyPrice:isNaN(a5)?'':a5.toFixed(0),
          constructionOutputValue:isNaN(a6)?'':a6.toFixed(0),
          changeClaimAmount:isNaN(a7)?'':a7.toFixed(0),
          percentage:isNaN(a8)?'':a8,
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

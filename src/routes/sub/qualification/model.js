import {addSubQua, querySubQuaList, updateSubQua} from '../../../services/sub/qualification'
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd";
import * as routerRedux from "react-router-redux";

export default {
  namespace: 'sub_qua',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
    subResume:[]
  },

  effects: {
    * fetch({payload,token}, {call, put}) {
     // console.log(payload)
      const response = yield call(querySubQuaList, payload,token);
      console.log(response)

      if (response.code == '200') {
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
    * add({payload,token}, {call, put}) {
      const response = yield call(addSubQua, payload,token);
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * queryProNames({payload, token}, {call, put}) {
      const response = yield call(queryProPerList, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveProName',
          payload: response.entity
        })
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
    },
    * update({payload,token}, {call, put}) {
      const response = yield call(updateSubQua, payload,token);
      if (response.code == '200') {
        return true
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * getResume({payload}, {call, put}) {
      yield put(routerRedux.push('/sub/resume',payload));
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
    saveSubResume(state, action) {
      return {
        ...state,
        subResume: action.payload
      }
    },
  },

};

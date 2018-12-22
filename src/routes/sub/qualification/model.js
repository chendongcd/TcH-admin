import {addSubQua, querySubQuaList, updateSubQua} from '../../../services/sub/qualification'
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";

export default {
  namespace: 'sub_qua',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: []
  },

  effects: {
    * fetch({payload,token}, {call, put}) {
      const response = yield call(querySubQuaList, payload,token);
      console.log(response)
      if (response.code == '200') {
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
    * add({payload,token}, {call, put}) {
      const response = yield call(addSubQua, payload,token);
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * queryProNames({payload, token}, {call, put}) {
      const response = yield call(queryProPerList, payload, token);
      console.log(response)
      if (response.code == '200') {
        yield put({
          type: 'saveProName',
          payload: response.entity
        })
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
    },
    * update({payload,token}, {call, put}) {
      const response = yield call(updateSubQua, payload,token);
      if (response.code == '200') {
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
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
    },
  },

};

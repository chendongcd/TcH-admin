import {addPro, updatePro, queryProDetail, queryProList, queryRule,updateProStatus} from '../../../services/system/sys_project'
import {message} from "antd/lib/index";

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {
  namespace: 'sys_pro',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {

    * addPro({payload, token}, {call, put}) {
      const response = yield call(addPro, payload, token);
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
    * updatePro({payload, token}, {call, put}) {
      const response = yield call(updatePro, payload, token);
      if (response.code == '200') {
        message.success('修改成功');
        return true
      }
      if(response.code=='401'){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * queryProList({payload}, {call, put}) {
      const response = yield call(queryProList, payload);
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
    * queryProDetail({payload}, {call, put}) {
      const response = yield call(queryProDetail, payload);
    },
    * updateProStatus({payload, token}, {call, put}) {
      const response = yield call(updateProStatus, payload, token);
      console.log(response)
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
  },

};

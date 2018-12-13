import {queryProInfoList, queryProInfoDetail, addProInfo, updateProInfo} from '../../../services/project/project'
import {queryProPerList} from "../../../services/system/sys_project";
import {message} from "antd/lib/index";

export default {
  namespace: 'pro_proInfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryProInfoList, payload, token);
      console.log(payload)
      if (response.code == '200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload, token}, {call, put}) {
      console.log(payload)
      const response = yield call(addProInfo, payload, token);
      console.log(response)
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      return false
    },
    * fetchDetail({payload, callback}, {call, put}) {
      const response = yield call(queryProInfoDetail, payload);
      if (callback) callback();
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateProInfo, payload, token);
      if (response.code == '200') {
        message.success('修改成功');
        return true
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

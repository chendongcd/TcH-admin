import {addSubQua, querySubQuaList, updateSubQua} from "../../../services/sub/qualification";
import {message} from "antd";
export default {
  namespace: 'sub_resume',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(querySubQuaList, payload);
      if (response.code == '200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload}, {call, put}) {
      const response = yield call(addSubQua, payload);
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      return false
    },

    * update({payload}, {call, put}) {
      const response = yield call(updateSubQua, payload);
      if (response.code == '200') {
        return true
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

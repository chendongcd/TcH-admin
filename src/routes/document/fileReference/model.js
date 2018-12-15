import {addRefer,queryReferList,updateRefer} from '../../../services/document/fileReference'
import {message} from "antd";
export default {
  namespace: 'fileRefer',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryReferList, payload, token);
      console.log(payload)
      if (response.code == '200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addRefer, payload, token);
      console.log(response)
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateRefer, payload, token);
      if (response.code == '200') {
        message.success('修改成功');
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

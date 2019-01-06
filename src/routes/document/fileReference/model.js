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
    * add({payload, token}, {call, put}) {
      const response = yield call(addRefer, payload, token);
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
    * update({payload, token}, {call, put}) {
      const response = yield call(updateRefer, payload, token);
      if (response.code == '200') {
        message.success('修改成功');
        return true
      }
      if(global.checkToken(response)){
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

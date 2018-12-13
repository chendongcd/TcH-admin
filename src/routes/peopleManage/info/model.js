import {queryPeopleList,addPeople,updatePeople} from "../../../services/peopleManage/peopleManage";
import {message} from "antd";
import {queryProPerList} from "../../../services/system/sys_project";
export default {
  namespace: 'peopleManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload,token}, {call, put}) {
      const response = yield call(queryPeopleList, payload);
      if (response.code == '200') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    * add({payload,token}, {call, put}) {
      const response = yield call(addPeople, payload,token);
      if (response.code == '200') {
        message.success('新增成功');
        return true
      }
      return false
    },
    * update({payload,token}, {call, put}) {
      const response = yield call(updatePeople, payload,token);
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

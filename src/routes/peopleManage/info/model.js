import {queryPeopleList,addPeople,updatePeople,del} from "../../../services/peopleManage/peopleManage";
import {message} from "antd";
import {queryProPerList} from "../../../services/system/sys_project";
export default {
  namespace: 'peopleManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
  },

  effects: {
    * fetch({payload,token}, {call, put}) {
      const response = yield call(queryPeopleList, payload);
      if (response.code == '200') {
        response.list = global.calcuIndex(response)
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
      const response = yield call(addPeople, payload,token);
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
    * update({payload,token}, {call, put}) {
      const response = yield call(updatePeople, payload,token);
      if (response.code == '200') {
        return true
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * del({payload, token}, {call, put}) {
      const response = yield call(del, payload, token);
     // response.list = global.calcuIndex(response)
      if (response.code == '200') {
        message.success('删除成功');
        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * queryProNames({payload, token}, {call, put}) {
      const response = yield call(queryProPerList, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveProName',
          payload: response.entity?response.entity:[]
        })
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
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

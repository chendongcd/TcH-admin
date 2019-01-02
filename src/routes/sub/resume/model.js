import {addRes,updateRes,queryResList,querySubList} from '../../../services/sub/resume'
import {message} from "antd";
import {queryPerTeamList} from "../../../services/downToBack/teamAccount"
import {queryProPerList} from "../../../services/system/sys_project";
export default {
  namespace: 'sub_resume',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    subNames: [],
    teamList:[],
    proNames:[]
  },

  effects: {
    * fetch({payload,token}, {call, put}) {
      const response = yield call(queryResList, payload,token);
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
      const response = yield call(addRes, payload,token);
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
      const response = yield call(updateRes, payload,token);
      if (response.code == '200') {
        return true
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
      return false
    },
    * querySubNames({payload, token}, {call, put}) {
      const response = yield call(querySubList, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveSubName',
          payload: response.entity
        })
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
    },
    * queryTeamNames({payload, token}, {call, put}) {
      const response = yield call(queryPerTeamList, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveTeamName',
          payload: response.entity
        })
      }
      if(global.checkToken(response)){
        yield put({type:'app/logout'})
        return false
      }
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
    saveProName(state, action) {
      return {
        ...state,
        proNames: action.payload
      }
    },
    saveSubName(state, action) {
      return {
        ...state,
        subNames: action.payload
      }
    },
    saveTeamName(state, action) {
      return {
        ...state,
        teamList: action.payload
      }
    },
  },

};

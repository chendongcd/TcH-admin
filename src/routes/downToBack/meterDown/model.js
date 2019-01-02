import {addDown, queryDownList, updateDown} from "../../../services/downToBack/meterDown";
import {queryProPerList} from "../../../services/system/sys_project";
import {querySubList} from "../../../services/sub/resume";
import {queryTeamList} from "../../../services/downToBack/teamAccount"
export default {
  namespace: 'meterDown',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
    subNames: [],
    teamList:{
      list: [],
      pagination: {},
    }
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryDownList, payload, token);
      if (response.code == '200') {
        if (response.list.length > 0) {
          let x = 0, y = 0, z = 0, a9 = 0, a10 = 0, a11 = 0, a12 = 0, a13 = 0
          response.list.forEach(a => {
            x += a.valuationPrice
            y += a.endedPrice
            a9 += a.valuationPriceReduce
            a10 += a.warranty
            a11 += a.performanceBond
            a12 += a.compensation
            a13 += a.shouldAmount
          })

          z = (x + y)!=0?Math.floor(x / (x + y) * 100) / 100:0
          let sum = {
            id: '合计:',
            valuationPrice: x,
            endedPrice: y,
            underRate: z,
            code: '合计:',
            valuationPriceReduce: a9,
            warranty: a10,
            performanceBond: a11,
            compensation: a12,
            shouldAmount: a13
          }
          response.list = [...response.list, sum]
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (response.code == '401') {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addDown, payload, token);
      if (response.code == '200') {
        return true
      }
      if (response.code == '401') {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateDown, payload, token);
      if (response.code == '200') {
        return true
      }
      if (response.code == '401') {
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
          payload: response.entity
        })
      }
      if (response.code == '401') {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * querySubNames({payload, token}, {call, put}) {
      const response = yield call(querySubList, payload, token);
      if (response.code == '200') {

        yield put({
          type: 'saveSubName',
          payload: response.entity
        })
      }
      if (response.code == '401') {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * queryTeams({payload, token}, {call, put}) {
      const response = yield call(queryTeamList, payload, token);
      if (response.code == '200') {

        yield put({
          type: 'saveTeamList',
          payload: response
        })
      }
      if (response.code == '401') {
        yield put({type: 'app/logout'})
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
    saveTeamList(state,action){
      return {
        ...state,
        teamList: action.payload
      }
    }
  },

};

import {queryTeamList, addTeam, updateCompany, updateTeam,queryContractCodes,querySum} from '../../../services/downToBack/teamAccount'
import {queryProPerList} from "../../../services/system/sys_project";
import {querySubList} from "../../../services/sub/resume";

export default {
  namespace: 'teamAccount',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
    subNames: [],
    contractCodes:[]
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryTeamList, payload, token);
      if (response.code == '200') {
        if(response.list.length>0){
          response.list = global.calcuIndex(response)
          if(global._getTotalPage(response.pagination.total)===response.pagination.current){
            yield put({
              type:'fetchSum',
              payload:payload,
              token:token,
              list:response.list.length
            })
          }
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
    * fetchSum({payload, token,list}, {call, put,select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.teamAccount.data))
        let sum = {
          ids: '合计:',
          estimatedContractAmount: response.entity.sumEstimatedContractAmount,
          realAmount: response.entity.sumRealAmount,
          settlementAmount: response.entity.sumSettlementAmount,
          shouldAmount: response.entity.sumShouldAmount
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])) {
            sum[a] = Number.isInteger(Number(sum[a])) ? Number(sum[a]) : Number(sum[a]).toFixed(2)
          }
        }
        data.list = [...data.list,sum]
        if(list===10) {
          data.pagination.pageSize = data.pagination.pageSize + 1
        }
        yield put({
          type: 'save',
          payload: data,
        });
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * add({payload, token}, {call, put}) {
      const response = yield call(addTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * update({payload, token}, {call, put}) {
      const response = yield call(updateTeam, payload, token);
      if (response.code == '200') {

        return true
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * updateCompany({payload, token}, {call, put}) {
      const response = yield call(updateCompany, payload, token);
      if (response.code == '200') {

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
      if (global.checkToken(response)) {
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
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * queryContractCodes({payload, token}, {call, put}) {
      const response = yield call(queryContractCodes, payload, token);
      if (response.code == '200') {
        yield put({
          type: 'saveContractCode',
          payload: response.entity
        })
      }
      if (global.checkToken(response)) {
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
    saveContractCode(state, action) {
      return {
        ...state,
        contractCodes: action.payload
      }
    },
  },

};

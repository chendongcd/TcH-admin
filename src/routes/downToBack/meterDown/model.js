import {addDown, queryDownList, updateDown,querySum,del} from "../../../services/downToBack/meterDown";
import {queryProPerList} from "../../../services/system/sys_project";
import {queryTeamLists,queryAmount,querySubList} from "../../../services/downToBack/teamAccount"
import {message} from 'antd';

export default {
  namespace: 'meterDown',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    proNames: [],
    subNames: [],
    teamList:[],
    sumAmount:''
  },

  effects: {
    * fetch({payload, token}, {call, put}) {
      const response = yield call(queryDownList, payload, token);
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
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * fetchSum({payload, token,list}, {call, put,select}) {
      const response = yield call(querySum, payload, token);
      if (response.code == '200') {
        const data = yield (select(_ => _.meterDown.data))
        console.log(response.entity)
        let sum = {
          ids: '合计:',
          valuationPrice: response.entity.sumValuationPrice,
          endedPrice: response.entity.sumEndedPrice,
          underRate: response.entity.percentage/100,
          valuationPriceReduce: response.entity.sumValuationPriceReduce,
          warranty: response.entity.sumWarranty,
          performanceBond: response.entity.sumPerformanceBond,
          compensation: response.entity.sumCompensation,
          shouldAmount: response.entity.sumShouldAmount
        }
        for(let a in sum){
          if(sum[a]&&!isNaN(sum[a])&&a!=='underRate'){
            sum[a] = Number.isInteger(Number(sum[a]))?Number(sum[a]):Number(sum[a]).toFixed(2)
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
      const response = yield call(addDown, payload, token);
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
      const response = yield call(updateDown, payload, token);
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
        if(response.entity&&response.entity.length==0){
          message.warning('该项目还没有所属分包商')
        }
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
    * queryTeams({payload, token}, {call, put}) {
      const response = yield call(queryTeamLists, payload, token);
      if (response.code == '200') {
        if(response.entity&&response.entity.length==0){
          message.warning('该项目和分包商还没有所属队伍')
        }
        yield put({
          type: 'saveTeamList',
          payload: response.entity
        })
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
    },
    * queryAmount({payload, token}, {call, put}) {
      const response = yield call(queryAmount, payload, token);
      if (response.code == '200') {
        return response.entity
      }
      if (global.checkToken(response)) {
        yield put({type: 'app/logout'})
        return false
      }
      return false
    },
    * del({payload, token}, {call, put}) {
      const response = yield call(del, payload, token);
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

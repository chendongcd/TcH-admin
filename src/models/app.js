import {routerRedux} from 'dva/router'
import {signIn,signOut} from '../services/app'
import config from 'config'
import {menuData} from '../common/menu'
import {setStorage,getStorage} from 'utils/localStorage'
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const {prefix} = config

function getMenu(user) {
  if(user&&user.id==0){
    return menuData
  }else if(user){
  return menuData.filter(a=>a.id!=2)
  }
  return []
}

export default {
  namespace: 'app',

  state: {
    user: getStorage('userInfo')||{},
    locationPathname: '',
    locationQuery: {},
    loading: false,
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    isNavbar: document.body.clientWidth < 769,
    menu: getMenu(getStorage('userInfo')),
    hasPermission:true,
    location:{}
  },

  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen((location) => {
        console.log(getStorage('userInfo'))
        console.log(location)
        dispatch({
          type: 'updateState',
            payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
            location
          },
        })
      })
    },
    setup({dispatch, history}) {  // eslint-disable-line
     // console.log(history)
    },
  },

  effects: {
    * showLoading({payload}, {call, put}) {
      yield call(delay, 500)
      yield put({type: 'updateState', payload: payload})
    },
    * login({payload}, {call, put}) {
      const res = yield call(signIn, payload)
      if (res.code == 200) {
        let menu = res.data.id==0?menuData:menuData.filter(a=>a.id!=2)
        setStorage('userInfo',res.data)
        yield put({type: 'updateState', payload: {user: res.data, loading: true,menu:menu}})
        yield put(routerRedux.push('/home'))
        yield call(delay, 500)
        yield put({type: 'updateState', payload: {loading: false}})
      }
      // yield put({ type: 'updateState',payload:payload })
    },

    * logout(_,{call,put}){
      yield put({type: 'updateState', payload: {loading: true,user:{}}})
      yield call(delay, 500)
      const response = yield call(signOut);
      if (response) {
        yield put(routerRedux.push('/login'));
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    }
  },

  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      console.log(state)
      console.log(`${prefix}darkTheme`, !state.darkTheme)
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },

};

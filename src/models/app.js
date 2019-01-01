import {routerRedux} from 'dva/router'
import {signIn, signOut} from '../services/app'
import config from 'config'
import {menuData} from '../common/menu'
import {getMenus} from 'utils'
import {setStorage, getStorage} from 'utils/localStorage'
const {prefix} = config
function getMenu(user) {
  if (user && user.id) {
    return getMenus([...user.permissionsMap.menu, ...[menuData[0].permission]])
  }
  return []
}

export default {
  namespace: 'app',

  state: {
    user: getStorage('userInfo') || {},
    locationPathname: '',
    locationQuery: {},
    loading: false,
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    isNavbar: document.body.clientWidth < 769,
    menu: getMenu(getStorage('userInfo')),
    hasPermission: true,
    location: {},
    contentWidth:'Fluid',
  },

  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen((location) => {
        console.log(location)
        dispatch({
          type: 'checkRouter',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
            location
          },
        })
      })
    },
    setup({dispatch, history}) {  // eslint-disable-line
    },
  },

  effects: {
    * showLoading({payload}, {call, put}) {
      yield put({type: 'updateState', payload: payload})
    },
    * login({payload}, {call, put}) {
      const res = yield call(signIn, payload)
      console.log(res)
      if (res.code == 200) {
        let menu = getMenus([...res.entity.permissionsMap.menu, ...[menuData[0].permission]])

        setStorage('userInfo', res.entity)
        yield put({type: 'updateState', payload: {user: res.entity, loading: true, menu: menu}})
        yield put(routerRedux.push('/home'))
        yield put({type: 'updateState', payload: {loading: false}})
      }
    },

    * logout(_, {call, put}) {
      yield put({type: 'updateState', payload: {loading: true, user: {}}})
      const response = yield call(signOut);
      if (response) {
        yield put(routerRedux.push('/login'));
      }
    },

    * changeNavbar(action, {put, select}) {
      const {app} = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({type: 'handleNavbar', payload: isNavbar})
      }
    },
    * checkRouter({payload},{call,put,select}){
    //  console.log(payload.locationPathname)
     // console.log(routers)
      //const perRouters =
      const {app:{menu,user}} = yield (select(_ => _))
      const paths = menu.filter(a=>a.route).map(b=>b.route)
    //  console.log(paths)
      if(![...paths,...["/404"]].includes(payload.locationPathname)&&user.token&&payload.locationPathname!='/') {
        yield put(routerRedux.push('/404'))
      }
      yield put({type: 'updateState', payload: payload})
    }
  },

  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      // console.log(state)
      // console.log(`${prefix}darkTheme`, !state.darkTheme)
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, {payload}) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, {payload: navOpenKeys}) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },

};


import config from 'config'

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const {prefix} = config
export default {

  namespace: 'home',

  state: {
    user: {},
    locationPathname: '',
    locationQuery: {},
    loading: true,
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    menu: [],
  },

  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen((location) => {
        console.log(location,0)

      })
    },
    setup({dispatch, history}) {  // eslint-disable-line
      console.log(history,1)
    },
  },

  effects: {

  },

  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },

};

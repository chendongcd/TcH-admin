import React from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './routes/Index'
import dynamic from 'dva/dynamic';
import appModel from './models/app'
// // 设置默认的加载组件
// dynamic.setDefaultLoadingComponent(() => {
//   return <Spin size="large" className={styles.globalSpin} />;
// });
/*class IndexPage extends Component{

  constructor(props){
    super(props)
  }
  render() {
    const app = this.props.app
    const Login = dynamic({
      app,
      models: [appModel],
      component:()=> import('./routes/login/index'),
    })
    const Home = dynamic({
      app,
      models: [appModel],
      component: ()=>import('./routes/home/index'),
    })
    const Sys_Project = dynamic({
      app,
      models: [appModel],
      component:()=> import('./routes/system/project/index'),
    })
    const Sys_Permission = dynamic({
      app,
      models: [appModel],
      component:()=> import('./routes/system/permission/index'),
    })
    const Sys_User = dynamic({
      app,
      models: [appModel],
      component:()=> import('./routes/system/user/index'),
    })
    return (
      <LocaleProvider locale={zhCN}>
        <App {...app}>
          <Switch>
            <Route  path="/home" exact component={Home}/>
            {/!*<Redirect path="/home" from="/" to="/home" component={Home}/>*!/}
            <Route path="/login" component={Login}/>
            <Route path="/system/project"  component={Sys_Project}/>
            <Route path="/system/permission"  component={Sys_Permission}/>
            <Route path="/system/user"  component={Sys_User}/>
            <Route path="/project"  component={Login}/>
            <Route path="/meteringUp"  component={Login}/>
            <Route path="/sub"  component={Login}/>
            <Route path="/meteringDown"  component={Login}/>
            <Route path="/manager"  component={Login}/>
            <Route path="/files"  component={Login}/>
          </Switch>
        </App>
      </LocaleProvider>
    );
  }
}*/

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}
const Routers = function ({history, app}) {
  const Login = dynamic({
    app,
    models: [appModel],
    component: () => import(/* webpackChunkName: "Login" */'./routes/login/index'),
  })
  const Home = dynamic({
    app,
    models: [appModel],
    component: () => import(/* webpackChunkName: "Home" */'./routes/home/index'),
  })
  const Sys_Project = dynamic({
    app,
    models: () => [import('./routes/system/project/model')],
    component: () => import(/* webpackChunkName: "SysProject" */'./routes/system/project/index'),
  })
  const Sys_Permission = dynamic({
    app,
    models: () => [import('./routes/system/permission/model')],
    component: () => import(/* webpackChunkName: "SysPermission" */'./routes/system/permission/index'),
  })
  const Sys_User = dynamic({
    app,
    models: () => [import('./routes/system/user/model')],
    component: () => import(/* webpackChunkName: "SysUser" */'./routes/system/user/index'),
  })
  const Pro_InfoCard = dynamic({
    app,
    models: () => [import('./routes/project/infoCard/model')],
    component: () => import(/* webpackChunkName: "InfoCard" */'./routes/project/infoCard/index'),
  })
  const Up_MeterUp = dynamic({
    app,
    models: () => [import('./routes/upToBack/meterUp/model')],
    component: () => import(/* webpackChunkName: "Meter" */'./routes/upToBack/meterUp/index'),
  })
  const Sub_Qualification = dynamic({
    app,
    models: () => [import('./routes/sub/qualification/model')],
    component: () => import(/* webpackChunkName: "Qualification" */'./routes/sub/qualification/index')
  })
  const Sub_Resume = dynamic({
    app,
    models: () => [import('./routes/sub/resume/model')],
    component: () => import(/* webpackChunkName: "Resume" */'./routes/sub/resume/index')
  })
  const Down_MeterDown = dynamic({
    app,
    models: () => [import('./routes/downToBack/meterDown/model')],
    component: () => import(/* webpackChunkName: "MeterDown" */'./routes/downToBack/meterDown/index')
  })
  const Down_TeamAccount = dynamic({
    app,
    models: () => [import('./routes/downToBack/teamAccount/model')],
    component: () => import(/* webpackChunkName: "TeamAccount" */'./routes/downToBack/teamAccount/index')
  })
  const Evaluate_Pro = dynamic({
    app,
    models: () => [import('./routes/evaluation/proEvaluate/model')],
    component: () => import(/* webpackChunkName: "ProEvaluate" */'./routes/evaluation/proEvaluate/index')
  })
  const People_Info = dynamic({
    app,
    models: () => [import('./routes/peopleManage/info/model')],
    component: () => import(/* webpackChunkName: "PeopleManage" */'./routes/peopleManage/info/index')
  })
  const Document_fileRead = dynamic({
    app,
    models: () => [import('./routes/document/fileRead/model')],
    component: () => import(/* webpackChunkName: "FileRead" */'./routes/document/fileRead/index')
  })
  const Document_fileReference = dynamic({
    app,
    models: () => [import('./routes/document/fileReference/model')],
    component: () => import(/* webpackChunkName: "FileReference" */'./routes/document/fileReference/index')
  })
  const NotFound = dynamic({
    app,
    models: [appModel],
    component: () => import(/* webpackChunkName: "404" */'./routes/error/404')
  })


  /*const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          cb(null, { component: require('./routes/home/index') })
        }, 'Home')
      },
      childRoutes: [
        // home
        {
          path: '/home',
          name: '/home',
          getIndexRoute (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, { component: require('./routes/home/index') })
            }, 'Home')
          },
        },
        // system
        {
          path: 'system',
          name: 'system',
          childRoutes: [
            {
              path: 'project',
              name: 'project',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/system/project/model'))
                  cb(null, require('./routes/system/project/index'))
                }, 'SysProject')
              },
            },
            {
              path: 'permission',
              name: 'permission',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/system/permission/model'))
                  cb(null, require('./routes/system/permission/index'))
                }, 'SysPermission')
              },
            },
            {
              path: 'user',
              name: 'user',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/system/user/model'))
                  cb(null, require('./routes/system/user/index'))
                }, 'SysUser')
              },
            },
          ],
        },
        // project
        {
          path: 'project',
          name: 'project',
          childRoutes: [
            {
              path: 'infoCard',
              name: 'infoCard',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/project/infoCard/model'))
                  cb(null, require('./routes/project/infoCard/index'))
                }, 'InfoCard')
              },
            },
          ],
        },
        // up
        {
          path: 'up',
          name: 'up',
          childRoutes: [
            {
              path: 'meterUp',
              name: 'meterUp',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/upToBack/meterUp/model'))
                  cb(null, require('./routes/upToBack/meterUp/index'))
                }, 'MeterUp')
              },
            },
          ],
        },
        // sub
        {
          path: 'sub',
          name: 'sub',
          childRoutes: [
            {
              path: 'qualification',
              name: 'qualification',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/sub/qualification/model'))
                  cb(null, require('./routes/sub/qualification/index'))
                }, 'Qualification')
              },
            }, {
              path: 'resume',
              name: 'resume',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/sub/resume/model'))
                  cb(null, require('./routes/sub/resume/index'))
                }, 'Resume')
              },
            },
          ],
        },
        // down
        {
          path: 'down',
          name: 'down',
          childRoutes: [
            {
              path: 'inspect',
              name: 'inspect',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/downToBack/meterDown/model'))
                  cb(null, require('./routes/downToBack/meterDown/index'))
                }, 'MeterDown')
              },
            }, {
              path: 'account',
              name: 'account',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/downToBack/teamAccount/model'))
                  cb(null, require('./routes/downToBack/teamAccount/index'))
                }, 'TeamAccount')
              },
            },
          ],
        },
        // evaluation
        {
          path: 'evaluation',
          name: 'evaluation',
          childRoutes: [
            {
              path: 'evaluate',
              name: 'evaluate',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/evaluation/proEvaluate/model'))
                  cb(null, require('./routes/evaluation/proEvaluate/index'))
                }, 'Evaluate')
              },
            },
          ],
        },
        // people
        {
          path: 'people',
          name: 'people',
          childRoutes: [
            {
              path: 'info',
              name: 'info',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/peopleManage/info/model'))
                  cb(null, require('./routes/peopleManage/info/index'))
                }, 'Info')
              },
            },
          ],
        },
        // document
        {
          path: 'files',
          name: 'files',
          childRoutes: [
            {
              path: 'read',
              name: 'read',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/document/fileRead/model'))
                  cb(null, require('./routes/document/fileRead/index'))
                }, 'FileRead')
              },
            }, {
              path: 'reference',
              name: 'reference',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./routes/document/fileReference/model'))
                  cb(null, require('./routes/document/fileReference/index'))
                }, 'Reference')
              },
            },
          ],
        },
        // noFound
        {
          path: '404',
          name: '404',
          getIndexRoute (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, { component: require('./routes/error/404') })
            }, '404')
          },
        },
      ],
    },
    // login
    {
      path: 'login',
      name: 'login',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./routes/login/index'))
        }, 'Login')
      },
    },
    // *
  ]*/

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
      {/*  <Switch>
          <Route path="/" exact component={App}>
            <IndexRoute  component={Home}/>
            <Route path="/system">
              <Route path="/project" component={Sys_Project}/>
              <Route path="permission" component={Sys_Permission}/>
              <Route path="/user" component={Sys_User}/>
            </Route>
            <Route path="/project">
              <Route path="/infoCard" component={Pro_InfoCard}/>
            </Route>
            <Route path="/up">
              <Route path="/meterUp" component={Up_MeterUp}/>
            </Route>
            <Route path="/sub">
              <Route path="/qualification" component={Sub_Qualification}/>
              <Route path="/resume" component={Sub_Resume}/>
            </Route>
            <Route path="/down">
              <Route path="/inspect" component={Down_MeterDown}/>
              <Route path="/account" component={Down_TeamAccount}/>
            </Route>
            <Route path="/people">
              <Route path="/info" component={People_Info}/>
            </Route>
            <Route path="/evaluation">
              <Route path="/evaluate" component={Evaluate_Pro}/>
            </Route>
            <Route path="/files">
              <Route path="/read" component={Document_fileRead}/>
              <Route path="/reference" component={Document_fileReference}/>
            </Route>
          </Route>
          <Route path="/login" component={Login}/>
          <Route path="/404" component={NotFound}/>
        </Switch>*/}
        <App>
          <Switch>
            <Redirect exact from="/"  to="/home"/>
            <Route path="/home" exact component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/system/project"  component={Sys_Project}/>
            <Route path="/system/permission"  component={Sys_Permission}/>
            <Route path="/system/user"  component={Sys_User}/>
            <Route path="/project/infoCard"  component={Pro_InfoCard}/>
            <Route path="/up/meterUp"  component={Up_MeterUp}/>
            <Route path="/sub/qualification"  component={Sub_Qualification}/>
            <Route path="/sub/resume"  component={Sub_Resume}/>
            <Route path="/down/inspect"  component={Down_MeterDown}/>
            <Route path="/down/account"  component={Down_TeamAccount}/>
            <Route path="/people/info"  component={People_Info}/>
            <Route path="/evaluation/evaluate"  component={Evaluate_Pro}/>
            <Route path="/files/read"  component={Document_fileRead}/>
            <Route path="/files/reference"  component={Document_fileReference}/>
            <Route path="/404"  component={NotFound}/>
          </Switch>
        </App>
      </Router>
    </LocaleProvider>
  );
}

export default Routers

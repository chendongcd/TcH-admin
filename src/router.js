import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './routes/Index'
import dynamic from 'dva/dynamic';
import appModel from './models/app'
// // 设置默认的加载组件
// dynamic.setDefaultLoadingComponent(() => {
//   return <Spin size="large" className={styles.globalSpin} />;
// });

function RouterConfig({history, app}) {
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


  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <App {...app}>
          <Switch>
            <Route  path="/" exact component={Home}/>
            <Route  path="/home" exact component={Home}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/system" exact component={Login}/>
            <Route path="/project" exact component={Login}/>
            <Route path="/meteringUp" exact component={Login}/>
            <Route path="/sub" exact component={Login}/>
            <Route path="/meteringDown" exact component={Login}/>
            <Route path="/manager" exact component={Login}/>
            <Route path="/files" exact component={Login}/>
          </Switch>
        </App>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

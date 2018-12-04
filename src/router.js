import React from 'react';
import {Router, Route, Switch,Redirect} from 'dva/router';
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
  const Sys_Project = dynamic({
    app,
    models: ()=>[import('./routes/system/project/model')],
    component:()=> import('./routes/system/project/index'),
  })
  const Sys_Permission = dynamic({
    app,
    models: ()=> [import('./routes/system/permission/model')],
    component:()=> import('./routes/system/permission/index'),
  })
  const Sys_User = dynamic({
    app,
    models:()=> [import('./routes/system/user/model')],
    component:()=> import('./routes/system/user/index'),
  })
  const Pro_InfoCard = dynamic({
    app,
    models: [appModel],
    component:()=> import('./routes/project/infoCard/index'),
  })
  const Up_MeterUp = dynamic({
    app,
    models: [appModel],
    component:()=> import('./routes/upToBack/meterUp/index'),
  })
  const Sub_Qualification = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/sub/qualification/index')
  })
  const Sub_Resume = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/sub/resume/index')
  })
  const Down_MeterDown = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/downToBack/meterDown/index')
  })
  const Down_TeamAccount = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/downToBack/teamAccount/index')
  })
  const Evaluate_Pro = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/evaluation/proEvaluate/index')
  })
  const People_Info = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/peopleManage/info/index')
  })
  const Document_fileRead = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/document/fileRead/index')
  })
  const Document_fileReference = dynamic({
    app,
    models:[appModel],
    component:()=> import('./routes/document/fileReference/index')
  })

  // const Project = dynamic({
  //   app,
  //   models: [appModel],
  //   component:()=> import('./project/index'),
  // })
  // const Permission = dynamic({
  //   app,
  //   models: [appModel],
  //   component:()=> import('./permission/index'),
  // })
  // const User = dynamic({
  //   app,
  //   models: [appModel],
  //   component:()=> import('./user/index'),
  // })

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <App {...app}>
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
          </Switch>
        </App>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

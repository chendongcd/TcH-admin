import React from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './routes/Index'
import dynamic from 'dva/dynamic';
import Project from './routes/system/project/index'

const Routers = function ({history, app}) {
  const Login = dynamic({
    app,
    models: [],
    component: () => import(/* webpackChunkName: "Login" */'./routes/login/index'),
  })
  const Home = dynamic({
    app,
    models: [],
    component: () => import(/* webpackChunkName: "Home" */'./routes/home/index'),
  })
/*  const Sys_Project = dynamic({
    app,
    models: () => [import('./routes/system/project/model')],
    component: () => import(/!* webpackChunkName: "SysProject" *!/'./routes/system/project/index'),
  })*/
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
    models: [],
    component: () => import(/* webpackChunkName: "404" */'./routes/error/404')
  })
  const Report_Expense_form = dynamic({
    app,
    models: () => [import('./routes/report/expense/form/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/expense/form/index')
  })
  const Report_Expense_daily = dynamic({
    app,
    models: () => [import('./routes/report/expense/daily/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/expense/daily/index')
  })
  const Report_form = dynamic({
    app,
    models: () => [import('./routes/report/form/month/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/form/month')
  })
  const Report_formTable = dynamic({
    app,
    models: () => [import('./routes/report/form/formTable/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/form/formTable/index')
  })
  const Report_loss= dynamic({
    app,
    models: () => [import('./routes/report/loss/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/loss/index')
  })
  const Report_confirm= dynamic({
    app,
    models: () => [import('./routes/report/confirm/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/confirm/index')
  })
  const Report_response= dynamic({
    app,
    models: () => [import('./routes/report/response/model')],
    component: () => import(/* webpackChunkName: "" ExpenseForm */'./routes/report/response/index')
  })


  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <App>
          <Switch>
            <Redirect exact from="/"  to="/home"/>
            <Route path="/home" exact component={Home}/>
            <Route path="/system/project"  component={Project}/>
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
            <Route path="/report/compensationForm"  component={Report_Expense_form}/>
            <Route path="/report/dailyWork"  component={Report_Expense_daily}/>
            <Route path="/report/form"  component={Report_form}/>
            <Route path="/report/formTable"  component={Report_formTable}/>
            <Route path="/report/loss"  component={Report_loss}/>
            <Route path="/report/confirm"  component={Report_confirm}/>
            <Route path="/report/response"  component={Report_response}/>
          </Switch>
          <Route path="/login" component={Login}/>
          <Route path="/404"  component={NotFound}/>
        </App>
      </Router>
    </LocaleProvider>
  );
}

export default Routers

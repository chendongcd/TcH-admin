/**
 * 我们为了统一方便的管理路由和页面的关系，将配置信息统一抽离到 common/nav.js 下，同时应用动态路由
 */

import dynamic from 'dva/dynamic';
import Login from '../routes/login/index';
import Home from '../routes/home/index'
// dynamic包装 函数
export const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
})
// nav data
export const getNavData = app => [
  dynamicWrapper(app,['app'],Login),
  dynamicWrapper(app,['app',Home])
];

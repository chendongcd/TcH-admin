const path =process.env.NODE_ENV=='production'?'':'public'
module.exports = {
  name: '成本管理系统',
  prefix: 'TcH-Admin',
  footerText: '成都甲戌时代科技 © 2018 Melon',
  logo:  'http://pjno2bd7f.bkt.clouddn.com/logo.png',//`${path}/logo.svg`,
  ico:`${path}/logo.png`,
  iconFontCSS: `${path}/iconfont.css`,
  iconFontJS: `${path}/iconfont.js`,
  apiPrefix: '/api/v1',
  apiDev:'http://47.105.127.126:8081/crcc',//http://47.105.127.126:8081/crcc //http://192.168.31.108:8081/crcc
  CORS: [],
}

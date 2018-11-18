const config = require('../src/utils/config')

const {apiPrefix} = config

let tableListDataSource = [];
const EnumRoleType = [
  'admin',
  'guest',
  'developer',
]
for (let i = 0; i < 300; i += 1) {

  tableListDataSource.push({
    code: (`CRCC23-3-年份-${i > 99 ? i : i > 9 ? `0${i}` : `00${i}`}`),
    key: i,
    disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    name: `TradeCode ${i}`,
    roleType: EnumRoleType[Math.floor(Math.random() * 2)],
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    proPassword: 1111,
    updateUser: '曲丽丽',
    desc: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}
module.exports = {
  [`GET ${apiPrefix}/rule`](req, res) {
    let dataSource = tableListDataSource;
    let params = req.body
    let pageSize = 10;
    if (params.pageSize) {
      pageSize = params.pageSize * 1;
    }

    const result = {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    }
    return res.json(result);
  }
}

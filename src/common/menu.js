export const menuData = [
  {
    id: '1',
    icon: 'home',
    name: '首页',
    route: '/home',
    permission:'PERMISSIONS_HOME'
  },
  {
    id: '2',
    icon: 'radius-setting',
    name: '系统管理',
    bpid: '1',
   // route: '/system',
    permission:'PERMISSIONS_SYSTEM'
  },
  {
    id: '21',
    bpid: '2',
    mpid: '2',
    name: '项目管理',
    route: '/system/project',
    permission:'PERMISSIONS_SYSTEM_PROJECT',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_SYSTEM_PROJECT_ADD'},
      {name:'编辑',permission:'PERMISSIONS_SYSTEM_PROJECT_UPDATE'},
      {name:'启用',permission:'PERMISSIONS_SYSTEM_PROJECT_ENABLE'},
      {name:'禁用',permission:'PERMISSIONS_SYSTEM_PROJECT_DISABLE'},
      {name:'导出',permission:'PERMISSIONS_SYSTEM_PROJECT_EXPORT'},
    ]
  },
  {
    id: '22',
    bpid: '2',
    mpid: '2',
    name: '权限管理',
    route: '/system/permission',
    permission:'PERMISSIONS_SYSTEM_PER',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_SYSTEM_PER_ADD'},
      {name:'编辑',permission:'PERMISSIONS_SYSTEM_PER_UPDATE'},
      {name:'权限设置',permission:'PERMISSIONS_SYSTEM_PER_SET'},
    ]
  },
  {
    id: '23',
    bpid: '2',
    mpid: '2',
    name: '用户管理',
    route: '/system/user',
    permission:'PERMISSIONS_SYSTEM_USER',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_SYSTEM_USER_ADD'},
      {name:'编辑',permission:'PERMISSIONS_SYSTEM_USER_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_SYSTEM_USER_LOOK'},
      {name:'启用',permission:'PERMISSIONS_SYSTEM_USER_ENABLE'},
      {name:'禁用',permission:'PERMISSIONS_SYSTEM_USER_DISABLE'},
      {name:'导出',permission:'PERMISSIONS_SYSTEM_USER_EXPORT'},
    ]
  },
  {
    id: '3',
    bpid: '1',
    icon: 'project',
    name: '项目部管理',
  //  route: '/project',
    permission:'PERMISSIONS_PROJECT_MANAGER',
  },
  {
    id: '31',
    bpid: '3',
    mpid: '3',
    name: '工程项目信息卡',
    route: '/project/infoCard',
    permission:'PERMISSIONS_PROJECT_MANAGER_INFO',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_PROJECT_MANAGER_INFO_ADD'},
      {name:'编辑',permission:'PERMISSIONS_PROJECT_MANAGER_INFO_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_PROJECT_MANAGER_INFO_LOOK'},
      {name:'导出',permission:'PERMISSIONS_PROJECT_MANAGER_INFO_EXPORT'},
    ]
  },
  {
    id: '4',
    bpid: '1',
    icon: 'up-square',
    name: '对上管理',
   // route: '/up',
    permission:'PERMISSIONS_UP_MANAGER',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: '对上计量台账填报表',
    route: '/up/meterUp',
    permission:'PERMISSIONS_UP_MANAGER_ACCOUNT',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_ADD'},
      {name:'编辑',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_LOOK'},
      {name:'导出',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_DELETE'},
    ]
  },
  {
    id: '42',
    bpid: '4',
    mpid: '4',
    name: '对上计量台账汇总表',
    route: '/up/summary',
    permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_TOTAL',
    buttons:[
      {name:'导出',permission:'PERMISSIONS_UP_MANAGER_ACCOUNT_TOTAL_EXPORT'},
    ]
  },
  {
    id: '5',
    bpid: '1',
    icon: 'schedule',
    name: '分包商管理',
   // route: '/sub',
    permission:'PERMISSIONS_SUB_MANAGER',
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    name: '分包商资质信息',
    route: '/sub/qualification',
    permission:'PERMISSIONS_SUB_MANAGER_INFO',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_SUB_MANAGER_INFO_ADD'},
      {name:'编辑',permission:'PERMISSIONS_SUB_MANAGER_INFO_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_SUB_MANAGER_INFO_LOOK'},
      {name:'导出',permission:'PERMISSIONS_SUB_MANAGER_INFO_EXPORT'},
      {name:'股份公司综合荣誉评价',permission:'PERMISSIONS_SUB_MANAGER_INFO_EVALUATION_GF'},
      {name:'集团公司综合荣誉评价',permission:'PERMISSIONS_SUB_MANAGER_INFO_EVALUATION_GROUP'},
      {name:'公司本级综合荣誉评价',permission:'PERMISSIONS_SUB_MANAGER_INFO_EVALUATION_COMPANY'},
      {name:'删除',permission:'PERMISSIONS_SUB_MANAGER_INFO_DELETE'},
    ]
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    name: '分包商履历',
    route: '/sub/resume',
    permission:'PERMISSIONS_SUB_MANAGER_RESUME',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_SUB_MANAGER_RESUME_ADD'},
      {name:'编辑',permission:'PERMISSIONS_SUB_MANAGER_RESUME_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_SUB_MANAGER_RESUME_LOOK'},
      {name:'导出',permission:'PERMISSIONS_SUB_MANAGER_RESUME_EXPORT'},
      {name:'项目部评价',permission:'PERMISSIONS_SUB_MANAGER_RESUME_EVALUATION_PROJECT'},
      {name:'删除',permission:'PERMISSIONS_SUB_MANAGER_RESUME_DELETE'},
    ]
  },
  {
    id: '6',
    bpid: '1',
    icon: 'down-square',
    name: '对下管理',
   // route: '/down',
    permission:'PERMISSIONS_DOWN_MANAGER',
  },
  {
    id: '61',
    bpid: '6',
    mpid: '6',
    name: '所属队伍台账填报表',
    route: '/down/account',
    permission:'PERMISSIONS_DOWN_MANAGER_TEAM',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_ADD'},
      {name:'修改',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_LOOK'},
      {name:'公司编辑',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_COMPANY'},
      {name:'导出',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_DOWN_MANAGER_TEAM_DELETE'},
    ]
  },
  {
    id: '62',
    bpid: '6',
    mpid: '6',
    name: '所属队伍台账汇总表',
    route: '/down/sumAccount',
    permission:'PERMISSIONS_DOWN_MANAGER_CHECK_LABOR',
    buttons:[
      {name:'导出',permission:'PPERMISSIONS_DOWN_MANAGER_CHECK_LABOR_EXPORT'},
    ]
  },
  {
    id: '63',
    bpid: '6',
    mpid: '6',
    name: '对下验工计价台账填报表',
    route: '/down/inspect',
    permission:'PERMISSIONS_DOWN_MANAGER_CHECK',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_ADD'},
      {name:'编辑',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_LOOK'},
      {name:'导出',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_DELETE'},
    ]
  },
  {
    id: '64',
    bpid: '6',
    mpid: '6',
    name: '对下验工计价台账汇总表',
    route: '/down/sumInspect',
    permission:'PERMISSIONS_DOWN_MANAGER_CHECK_PROJECT',
    buttons:[
      {name:'导出',permission:'PERMISSIONS_DOWN_MANAGER_CHECK_PROJECT_EXPORT'},
    ]
  },
  {
    id: '7',
    bpid: '1',
    icon: 'team',
    name: '经管人员管理',
  //  route: '/people',
    permission:'PERMISSIONS_PEOPLE_MANAGER',
  },
  {
    id: '71',
    bpid: '7',
    mpid: '7',
    name: '人员信息',
    route: '/people/info',
    permission:'PERMISSIONS_PEOPLE_MANAGER_INFO',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_PEOPLE_MANAGER_INFO_ADD'},
      {name:'编辑',permission:'PERMISSIONS_PEOPLE_MANAGER_INFO_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_PEOPLE_MANAGER_INFO_LOOK'},
      {name:'导出',permission:'PERMISSIONS_PEOPLE_MANAGER_INFO_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_PEOPLE_MANAGER_INFO_DELETE'},
    ]
  },
  {
    id: '8',
    bpid: '1',
    icon: 'edit',
    name: '项目评估台账',
  //  route: '/evaluation',
    permission:'PERMISSIONS_PROJECT_ACCOUNT',
  },
  {
    id: '81',
    bpid: '8',
    mpid: '8',
    name: '项目评估',
    route: '/evaluation/evaluate',
    permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION_ADD'},
      {name:'编辑',permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION_LOOK'},
      {name:'导出',permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_PROJECT_ACCOUNT_EVALUATION_DELETE'},
    ]
  },
  {
    id: '9',
    bpid: '1',
    icon: 'file-text',
    name: '报表管理',
    //route: '/report',
    permission:'PERMISSIONS_REPORT',
  },
  {
    id: '91',
    bpid: '9',
    mpid: '9',
    name: '合同外计日工及赔偿费用',
   // route: '/report/expense',
    permission:'PERMISSIONS_REPORT_CONTRACT',
  },
  {
    id: '911',
    bpid: '91',
    mpid: '91',
    name: '项目填报表',
    title:'项目填报表',
    route: '/report/compensationForm',
    permission:'PERMISSIONS_REPORT_CONTRACT_DAILY',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_REPORT_CONTRACT_DAILY_ADD'},
      {name:'编辑',permission:'PERMISSIONS_REPORT_CONTRACT_DAILY_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_REPORT_CONTRACT_DAILY_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_CONTRACT_DAILY_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_REPORT_CONTRACT_DAILY_DELETE'},
    ]
  },
  {
    id: '912',
    bpid: '91',
    mpid: '91',
    name: '汇总表',
    title:'汇总表',
    route: '/report/dailyWork',
    permission:'PERMISSIONS_REPORT_CONTRACT_STATISTICS',
    buttons:[
      {name:'查看',permission:'PERMISSIONS_REPORT_CONTRACT_STATISTICS_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_CONTRACT_STATISTICS_EXPORT'},
    ]
  },
  {
    id: '92',
    bpid: '9',
    mpid: '9',
    name: '变更索赔管理',
    // route: '/report/expense',
    permission:'PERMISSIONS_REPORT_CHANGED',
  },
  {
    id: '921',
    bpid: '92',
    mpid: '92',
    name: '工程变更索赔月快报表',
    route: '/report/form',
    permission:'PERMISSIONS_REPORT_CHANGED_YUE',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_REPORT_CHANGED_YUE_ADD'},
      {name:'编辑',permission:'PERMISSIONS_REPORT_CHANGED_YUE_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_REPORT_CHANGED_YUE_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_CHANGED_YUE_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_REPORT_CHANGED_YUE_DELETE'},
    ]
  },
  {
    id: '922',
    bpid: '92',
    mpid: '92',
    name: '变更索赔情况统计表',
    route: '/report/formTable',
    permission:'PERMISSIONS_REPORT_CHANGED_STATISTICS',
    buttons:[
      {name:'查看',permission:'PERMISSIONS_REPORT_CHANGED_STATISTICS_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_CHANGED_STATISTICS_EXPORT'},
    ]
  },
  {
    id: '93',
    bpid: '9',
    mpid: '9',
    name: '亏损报表',
    route: '/report/loss',
    permission:'PERMISSIONS_REPORT_LOSS',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_REPORT_LOSS_ADD'},
      {name:'编辑',permission:'PERMISSIONS_REPORT_LOSS_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_REPORT_LOSS_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_LOSS_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_REPORT_LOSS_DELETE'},
    ]
  },
  {
    id: '94',
    bpid: '9',
    mpid: '9',
    name: '确权清收表',
    route: '/report/confirm',
    permission:'PERMISSIONS_REPORT_CONFIRMATION',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_REPORT_CONFIRMATION_ADD'},
      {name:'编辑',permission:'PERMISSIONS_REPORT_CONFIRMATION_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_REPORT_CONFIRMATION_LOOK'},
      {name:'导出',permission:'PERMISSIONS_REPORT_CONFIRMATION_EXPORT'},
      {name:'删除',permission:'PERMISSIONS_REPORT_CONFIRMATION_DELETE'},
    ]
  },
  {
    id: '95',
    bpid: '9',
    mpid: '9',
    name: '责任成本快报',
    route: '/report/response',
    permission:'PERMISSIONS_REPORT_LIABILITY',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_REPORT_LIABILITY_ADD'},
      {name:'编辑',permission:'PERMISSIONS_REPORT_LIABILITY_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_REPORT_LIABILITY_LOOK'},
      {name:'删除',permission:'PERMISSIONS_REPORT_LIABILITY_DELETE'},
      /* {name:'导出',permission:'PERMISSIONS_REPORT_CONFIRMATION_EXPORT'},*/
    ]
  },
  {
    id: '10',
    bpid: '1',
    icon: 'folder',
    name: '文档管理',
  //  route: '/files',
    permission:'PERMISSIONS_FILE_MANAGER',
  },
  {
    id: '11',
    bpid: '10',
    mpid: '10',
    name: '文件阅览',
    route: '/files/read',
    permission:'PERMISSIONS_FILE_MANAGER_YULAN',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_FILE_MANAGER_YULAN_ADD'},
      {name:'编辑',permission:'PERMISSIONS_FILE_MANAGER_YULAN_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_FILE_MANAGER_YULAN_LOOK'},
    ]
  },
  {
    id: '12',
    bpid: '10',
    mpid: '10',
    name: '参考文献',
    route: '/files/reference',
    permission:'PERMISSIONS_FILE_MANAGER_WENXIAN',
    buttons:[
      {name:'新增',permission:'PERMISSIONS_FILE_MANAGER_WENXIAN_ADD'},
      {name:'编辑',permission:'PERMISSIONS_FILE_MANAGER_WENXIAN_UPDATE'},
      {name:'查看',permission:'PERMISSIONS_FILE_MANAGER_WENXIAN_LOOK'},
    ]
  },
]

export const proTypes = [
  {
    "id": 1,
    "value": "市政工程",
    "type": "project_type",
    "description": "市政工程"
  },
  {
    "id": 2,
    "value": "房建工程",
    "type": "project_type",
    "description": "房建工程"
  },
  {
    "id": 3,
    "value": "铁路工程",
    "type": "project_type",
    "description": "铁路工程"
  },
  {
    "id": 4,
    "value": "公路工程",
    "type": "project_type",
    "description": "公路工程"
  },
  {
    "id": 5,
    "value": "水利工程",
    "type": "project_type",
    "description": "水利工程"
  },
  {
    "id": 6,
    "value": "国防工程",
    "type": "project_type",
    "description": "国防工程"
  },
  {
    "id": 7,
    "value": "其他",
    "type": "project_type",
    "description": "其他工程"
  }
]


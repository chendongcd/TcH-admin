export const menuData = [
  {
    id: '1',
    icon: 'home',
    name: '首页',
    route: '/home',
    permissions:'PERMISSIONS_HOME'
  },
  {
    id: '2',
    icon: 'radius-setting',
    name: '系统管理',
    bpid: '1',
    route: '/system',
    permissions:'PERMISSIONS_SYSTEM'
  },
  {
    id: '21',
    bpid: '2',
    mpid: '2',
    name: '项目管理',
    route: '/system/project',
    permissions:'PERMISSIONS_SYSTEM_PROJECT'
  },
  {
    id: '22',
    bpid: '2',
    mpid: '2',
    name: '权限管理',
    route: '/system/permission',
    permissions:'PERMISSIONS_SYSTEM_PER'
  },
  {
    id: '23',
    bpid: '2',
    mpid: '2',
    name: '用户管理',
    route: '/system/user'
  },
  {
    id: '3',
    bpid: '1',
    icon: 'project',
    name: '项目部管理',
    route: '/project',
    permissions:'PERMISSIONS_SYSTEM_PROJECT'
  },
  {
    id: '31',
    bpid: '3',
    mpid: '3',
    name: '工程项目信息卡',
    route: '/project/infoCard',
  },
  {
    id: '4',
    bpid: '1',
    icon: 'up-square',
    name: '对上管理',
    route: '/up',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: '对上计量台账',
    route: '/up/meterUp',
  },
  {
    id: '5',
    bpid: '1',
    icon: 'schedule',
    name: '分包商管理',
    route: '/sub',
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    name: '分包商资质信息',
    route: '/sub/qualification',
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    name: '分包商履历',
    route: '/sub/resume',
  },
  {
    id: '6',
    bpid: '1',
    icon: 'down-square',
    name: '对下管理',
    route: '/down',
  },
  {
    id: '61',
    bpid: '6',
    mpid: '6',
    name: '所属队伍台账',
    route: '/down/account',
  },
  {
    id: '62',
    bpid: '6',
    mpid: '6',
    name: '对下验工计价台账',
    route: '/down/inspect',
  },
  {
    id: '7',
    bpid: '1',
    icon: 'team',
    name: '经管人员管理',
    route: '/people',
  },
  {
    id: '71',
    bpid: '7',
    mpid: '7',
    name: '人员信息',
    route: '/people/info',
  },
  {
    id: '8',
    bpid: '1',
    icon: 'edit',
    name: '项目评估台账',
    route: '/evaluation',
  },
  {
    id: '81',
    bpid: '8',
    mpid: '8',
    name: '项目评估',
    route: '/evaluation/evaluate',
  },
  {
    id: '9',
    bpid: '1',
    icon: 'file-text',
    name: '报表管理',
    route: '/report',
  },
  {
    id: '10',
    bpid: '1',
    icon: 'folder',
    name: '文档管理',
    route: '/files',
  },
  {
    id: '11',
    bpid: '10',
    mpid: '10',
    name: '文件阅览',
    route: '/files/read',
  },
  {
    id: '12',
    bpid: '10',
    mpid: '10',
    name: '参考文献',
    route: '/files/reference',
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


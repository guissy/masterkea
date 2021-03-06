import { MenuItem } from './Menus.model';

export const menusData = [
  {
    "id": 1,
    "name": "彩票游戏管理",
    "icon": "laptop",
    "path": "/lottery",
    "children": [
      {
        "id": 11,
        "bpid": 1,
        "mpid": 1,
        "name": "彩期管理",
        "icon": "laptop",
        "path": "/lottery/date"
      },
      {
        "id": 12,
        "bpid": 1,
        "mpid": 1,
        "name": "开奖结果管理",
        "icon": "laptop",
        "path": "/lottery/result"
      },
      {
        "id": 13,
        "bpid": 1,
        "mpid": 1,
        "name": "六合彩彩期",
        "icon": "laptop",
        "path": "/lottery/lhc"
      }
    ]
  },
  {
    "id": 3,
    "name": "账号管理",
    "icon": "user",
    "path": "/account",
    "children": [
      {
        "id": 31,
        "bpid": 3,
        "mpid": 3,
        "name": "厅主账号管理",
        "icon": "user",
        "path": "/account/hall"
      },
      {
        "id": 32,
        "bpid": 3,
        "mpid": 3,
        "name": "新增厅主",
        "icon": "user",
        "path": "/account/build"
      },
      {
        "id": 33,
        "bpid": 3,
        "mpid": 3,
        "name": "业务单元",
        "icon": "user",
        "path": "/account/webset"
      },
      {
        "id": 34,
        "bpid": 3,
        "mpid": 3,
        "name": "子账号管理",
        "icon": "user",
        "path": "/account/sub"
      },
      {
        "id": 35,
        "bpid": 3,
        "mpid": 3,
        "name": "角色管理",
        "icon": "user",
        "path": "/account/role"
      },
      {
        "id": 36,
        "bpid": 3,
        "mpid": 3,
        "name": "跨厅账号查询",
        "icon": "user",
        "path": "/account/halluser"
      },
      {
        "id": 37,
        "bpid": 3,
        "mpid": 3,
        "name": "游戏账号管理",
        "icon": "user",
        "path": "/account/gameid"
      }
    ]
  },
  {
    "id": 4,
    "name": "现金系统",
    "icon": "bank",
    "path": "/cash",
    "children": [
      {
        "id": 41,
        "bpid": 4,
        "mpid": 4,
        "name": "银行管理",
        "icon": "bank",
        "path": "/cash/bank"
      },
      {
        "id": 42,
        "bpid": 4,
        "mpid": 4,
        "name": "支付平台配置",
        "icon": "bank",
        "path": "/cash/pay"
      },
      {
        "id": 46,
        "bpid": 4,
        "mpid": 4,
        "name": "币种设定",
        "icon": "bank",
        "path": "/cash/currency"
      }
    ]
  },
  {
    "id": 5,
    "name": "运营中心",
    "icon": "global",
    "path": "/operation",
    "children": [
      {
        "id": 51,
        "bpid": 5,
        "mpid": 5,
        "name": "厅主费用设置",
        "icon": "global",
        "path": "/market/hallcost"
      },
      {
        "id": 52,
        "bpid": 5,
        "mpid": 5,
        "name": "各厅主交收表",
        "icon": "global",
        "path": "/operation/operation"
      },
      {
        "id": 53,
        "bpid": 5,
        "mpid": 5,
        "name": "内容审核",
        "icon": "global",
        "path": "/operation/review"
      }
    ]
  },
  {
    "id": 6,
    "name": "报表管理",
    "icon": "area-chart",
    "path": "/report",
    "children": [
      {
        "id": 61,
        "bpid": 6,
        "mpid": 6,
        "name": "期数设定",
        "icon": "area-chart",
        "path": "/report/periods"
      },
      {
        "id": 62,
        "bpid": 6,
        "mpid": 6,
        "name": "总报表",
        "icon": "area-chart",
        "path": "/report/summary"
      },
      {
        "id": 63,
        "bpid": 6,
        "mpid": 6,
        "name": "游戏报表",
        "icon": "area-chart",
        "path": "/report/gameReport"
      }
    ]
  },
  {
    "id": 7,
    "name": "系统设置",
    "icon": "setting",
    "path": "/setting",
    "children": [
      {
        "id": 71,
        "bpid": 7,
        "mpid": 7,
        "name": "游戏平台接口",
        "icon": "setting",
        "path": "/setting/game"
      },
      {
        "id": 72,
        "bpid": 7,
        "mpid": 7,
        "name": "后台操作日志",
        "icon": "setting",
        "path": "/setting/systemLog"
      },
      {
        "id": 73,
        "bpid": 7,
        "mpid": 7,
        "name": "IP限制",
        "icon": "setting",
        "path": "/setting/ipblacks"
      },
      {
        "id": 74,
        "bpid": 7,
        "mpid": 7,
        "name": "M令牌管理",
        "icon": "setting",
        "path": "/setting/mtoken"
      }
    ]
  },
  {
    "id": 8,
    "name": "公告消息",
    "icon": "message",
    "path": "/notice",
    "children": [
      {
        "id": 81,
        "bpid": 8,
        "mpid": 8,
        "name": "游戏公告",
        "icon": "message",
        "path": "/notice/notice"
      },
      {
        "id": 82,
        "bpid": 8,
        "mpid": 8,
        "name": "厅主消息",
        "icon": "message",
        "path": "/notice/message"
      }
    ]
  },
  {
    "id": 9,
    "name": "风险控制异常注单",
    "icon": "exclamation",
    "path": "/risk/order"
  }
] as MenuItem[];

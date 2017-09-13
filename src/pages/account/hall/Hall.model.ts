import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import BaseModel from '../../abstract/BaseModel';
import * as service from './Hall.service';
import { stringify } from 'querystring';
import { call } from 'redux-saga/effects';
import { withWebset } from '../webset/Webset.model';
import { withHallList } from './Hall.model.pk';

const model = new BaseModel('hall', {
  itemName: '',
  hallGameLoading: false,
  hallGame: {},
  hallLoginLoading: true,
  hallLogin: {},
  hallInfoLoading: true,
  saveHallInfoLoading: false,
  hallInfo: {},
  sendMessageLoading: true,
  simpleList: [],
}, service);
model.addEffect('hallInfo'); // 获取指定厅主的平台资料
model.addEffect('hallGame'); // 获取指定厅主的游戏设置
model.addEffect('hallLogin'); // 获取指定厅主的登录资料
model.addEffect('exist'); // 指定厅主账号的同名检测
model.addEffect('accountExist'); // 指定厅主登录账号的同名检测
model.addEffect('prefixExist'); // 指定厅主前缀的同名检测
model.addEffect('saveHallInfo', '保存资料', true);
model.addEffect('saveHallGame', '设置游戏');
model.addEffect('saveHallLogin', '设置账号', true);
model.addEffect('sendMessage', '发送消息');
model.addEffect('whitelist', 'IP白名单');

const effects = {
  *openBackend({ payload }: any) {
    const windowObj = window.open('', '_blank');
    windowObj.document.write('Loading...');
    const result = yield call(service.openBackendAjax, payload);
    if (result && result.state === 0) {
      const { is_ssl, domain, ...query } = result.data;
      const http = Boolean(Number(is_ssl)) ? 'https://' : 'http://';
      const href = http + domain + `?path=index&` + stringify(query);
      console.info('\u2714 Hall.model.ts openBackend 36', href);
      windowObj.location.href = href;
    }
  },
};
export const withHall = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: { ...model.effects, ...effects },
  props: {
    site: withLang,
    noAssign: withWebset,
    simpleList: withHallList,
  },
});

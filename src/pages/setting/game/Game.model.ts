import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Game.service';
import { message, Modal } from 'antd';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
const state = {
  itemName: '游戏平台',
  maintainVisible: false,
  time: [] as any,
};

const model = new BaseModel('game', state, service);
model.addEffect('maintain', '时间修改成功');
model.addEffect('status', ({ status }) => status ? '开放中' : '维护中');

export const withGame: any = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface GameState extends BaseState {
  maintainVisible: boolean;
}

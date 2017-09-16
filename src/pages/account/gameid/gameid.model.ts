import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './gameid.service';
import { message, Modal } from 'antd';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
const state = {
  itemName: '游戏账号管理',
  name: [] as any,
};

const model = new BaseModel('gameid', state, service);
model.addEffect('name', '更新');
export const withGameid = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});
export interface GameidState extends BaseState {
  name: any[];
}

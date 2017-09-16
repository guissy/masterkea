import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './gameid.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
import { withHallList } from '../hall/Hall.model.pk';

const state = {
  itemName: '游戏账号管理',
  name: [] as any,
};

const model = new BaseModel('gameid', state, service);
model.addEffect('names', '更新');
export const withGameid = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHallList,
  },
});
export interface GameidState extends BaseState {
  name: any[];
}

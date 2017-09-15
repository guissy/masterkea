import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Mtoken.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import { withHallList } from '../../account/hall/Hall.model.pk';
const state = {
  itemName: 'M令牌',
};

const model = new BaseModel('mtoken', state, service);
// 允许 or 限制
model.addEffect('update', ({ id, status }) => (status === 'enable' ? `ID: ${id}： 允许` : `ID ${id}： 限制`));
export const withMtoken = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHallList,
  },
})

export interface MtokenState extends BaseState {
  list: any[];
}

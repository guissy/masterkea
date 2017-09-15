import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Order.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import { withHallList } from '../../account/hall/Hall.model.pk';
const state = {
  itemName: '风险控制',
};

const model = new BaseModel('order', state, service);
export const withOrder = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHallList,
  },
})

export interface OrderState extends BaseState {
  list: any[];
}

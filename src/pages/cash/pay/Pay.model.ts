import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Pay.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';

const state = {
  itemName: '支付平台',
};

const model = new BaseModel('pay', state, service);
export const withPay = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface PayState extends BaseState {
  list: any[];
}

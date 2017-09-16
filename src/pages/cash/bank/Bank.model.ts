import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Bank.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';

const state = {
  itemName: '银行',
};

const model = new BaseModel('bank', state, service);
export const withBank = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface BankState extends BaseState {
  list: any[];
}

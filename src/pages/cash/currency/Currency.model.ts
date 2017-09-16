import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Currency.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
const state = {
  itemName: '',
};

const model = new BaseModel('currency', state, service);
export const withCurrency = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface CurrencyState extends BaseState {
  list: any[];
}

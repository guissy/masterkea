import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Periods.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
const state = {
  itemName: '一年期数',
};

const model = new BaseModel('periods', state, service);
model.addEffect('periods');
export const withPeriods = createWith({
  namespace: model.namespace,
  state: model.state,
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface PeriodsState extends BaseState {
  list: any[];
}

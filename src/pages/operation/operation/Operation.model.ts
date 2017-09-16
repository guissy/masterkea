import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Operation.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
import { withPeriods } from '../../report/periods/Periods.model';
import { withHallList } from '../../account/hall/Hall.model.pk';

const state = {
  itemName: '',
  attributes: {
    page_sum: 0,
    total_sum: 0,
  },
};

const model = new BaseModel('operation', state, service);
model.addEffect('infoOp', ({ status }) => (status === 0 ? '不允许设置为『未支付』！' : '设置'));
export const withOperation = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    periods: withPeriods,
    simpleList: withHallList,
  },
});

export interface OperationState extends BaseState {
  list: any[];
}

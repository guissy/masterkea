import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Summary.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import { withHallList } from '../../account/hall/Hall.model.pk';
const state = {
  itemName: '',
};

const model = new BaseModel('summary', state, service);
export const withSummary = createWith({
  namespace: model.namespace,
  state: model.state,
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHallList,
  },
});

export interface SummaryState extends BaseState {
  list: any[];
}

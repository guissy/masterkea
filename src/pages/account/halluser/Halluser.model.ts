import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Halluser.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
const state = {
  list: [] as any,
  itemName: '跨厅账号查询',
  loading: false,
};

const model = new BaseModel('halluser', state, service);
export const withHalluser = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface HalluserState extends BaseState {
  list: any[];
}

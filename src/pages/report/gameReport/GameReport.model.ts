import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './GameReport.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
const state = {
  itemName: '',
};

const model = new BaseModel('gameReport', state, service);
export const withGameReport = createWith({
  namespace: model.namespace,
  state: model.state,
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface GameReportState extends BaseState {
  list: any[];
}

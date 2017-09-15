import { BaseState } from '../../abstract/BaseModel';
import * as service from './Logs.service';
import { withLang } from '../../lang.model';
import BaseModel from '../../abstract/BaseModel';
import createWith from '../../../utils/buildKea';

const state = {
itemName: '',
};


const model = new BaseModel('logs', { itemName: '' }, service);
export const withLogs = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
})

export interface LogsState extends BaseState {
  list: any[];
}

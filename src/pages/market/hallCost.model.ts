import { default as BaseModel, BaseState } from '../abstract/BaseModel';
import * as service from './hallCost.service';
import createWith from '../../utils/buildKea';
import { withLang } from '../lang.model';
const state = {
  game: [] as any,
  recharge: {},
  packet: {},
  addFormVisible: false,
  maintainVisible: false,
  dataSource: [] as any[], // 暂存的表格数据，
};

const model = new BaseModel('hallCost', state, service);
export const withHallCost = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface HallCostState extends BaseState {
  recharge: { offline: any; online: any };
  game: any[];
  packet: { line: any; service: any; mincost: any[] };
  dataSource: any[];
}

import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Build.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
import { withWebset } from '../webset/Webset.model';
const state = {
  itemName: '厅主',
};

const model = new BaseModel('build', state, service);
model.addEffect('build', '新增厅主');
export const withBuiuld = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    noAssign: withWebset,
  },
});

export interface BuildState extends BaseState {
  buildLoading: boolean;
  hall_id: number;
  hallGame: any;
  // 虽然是 addEffect, 但没有 build.build 字段
  // build: { hall_id: number }; // 新增厅主提交后的获取id
}

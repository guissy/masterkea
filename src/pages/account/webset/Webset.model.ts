import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Webset.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import { withHall } from '../hall/Hall.model';

const model = new BaseModel('webset', { itemName: '' }, service);
model.addEffect('threshold'); // 负载等级
model.addEffect('noAssign'); // 未占用
model.addEffect('assign', '业务单元'); // 绑定业务单元到厅主
model.addEffect('manual'); // 配置手册
model.addEffect('templates'); // 配置模板
export const withWebset: any = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHall,
  },
})

export interface WebsetState extends BaseState {
  list: any[];
  noAssign: any[];
  template: any[];
}

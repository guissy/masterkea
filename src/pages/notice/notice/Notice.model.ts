import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import { withLang } from '../../lang.model';
import * as service from './Notice.service';
import createWith from '../../../utils/buildKea';
const state = {
  itemName: '游戏公告',
};

const model = new BaseModel('notice', state, service);
model.addEffect('type');

export const withNotice = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    langList: withLang,
  },
})

export interface NoticeState extends BaseState {
  list: any[];
}

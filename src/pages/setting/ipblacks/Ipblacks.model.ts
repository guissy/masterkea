import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Ipblacks.service';
import { message, Modal } from 'antd';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
const state = {
  itemName: 'IP',
};

const model = new BaseModel('ipblacks', state, service);
export const withIpblacks = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
})
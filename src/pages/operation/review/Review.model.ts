import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Review.service';
import createWith from '../../../utils/buildKea';
import { withLang } from '../../lang.model';
const state = {
  itemName: '',
};

const model = new BaseModel('review', state, service);
export const withReview = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface ReviewState extends BaseState {}

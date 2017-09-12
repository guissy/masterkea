import * as service from './Hall.service';
import BaseModel from '../../abstract/BaseModel';
import createWith from '../../../utils/buildKea';

const model = new BaseModel('hall', { itemName: '' }, service);
model.addEffect('simpleList');
export const withHallList = createWith({
  namespace: model.namespace + 'List',
  state: { simpleList: [] },
  actions: {},
  effects: { simpleList: model.effects.simpleList },
});

import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Mtoken.service';
const state = {
  itemName: 'M令牌',
};

const model = new BaseModel('mtoken', state, service);
// 允许 or 限制
model.addEffect('update', ({ id, status }) => (status === 'enable' ? `ID: ${id}： 允许` : `ID ${id}： 限制`));
export default model;

export interface MtokenState extends BaseState {
  list: any[];
}

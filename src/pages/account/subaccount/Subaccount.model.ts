import { BaseState, default as BaseModel, Store } from '../../abstract/BaseModel';
import * as service from './Subaccount.service';

const state = {
  itemName: '子账号',
};

const model = new BaseModel('subaccount', state, service);
model.addEffect('exists'); // 同名检测
model.addEffect('password', '修改密码');
export default model;

export interface SubaccountState extends BaseState {
  list: any[];
}

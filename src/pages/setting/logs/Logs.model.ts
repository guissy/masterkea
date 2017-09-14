import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Logs.service';
const state = {
  itemName: '',
};

const model = new BaseModel('logs', state, service);
export default model;

export interface LogsState extends BaseState {
  list: any[];
}

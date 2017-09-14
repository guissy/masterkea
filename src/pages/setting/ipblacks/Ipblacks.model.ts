import { EffectsCommandMap } from 'dva';
import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import * as service from './Ipblacks.service';
import { message, Modal } from 'antd';
const state = {
  itemName: 'IP',
};

const model = new BaseModel('ipblacks', state, service);

const effects = {
  *gameName({ payload }: any, { call, put, select }: EffectsCommandMap) {
    const dele = yield call(service.deleteAjax, payload);
    if (dele.state === 0) {
      yield put({ payload, type: 'deleteSuccess' });
      yield put({ type: 'query' });
      message.info(`删除成功`);
    } else {
      Modal.error({
        content: dele.message || `提交失败，请稍后再试！`,
      });
    }
  },

  *select({ payload }: any, { call, put, select }: EffectsCommandMap) {
    const dele = yield call(service.updateAjax, payload);
    if (dele.state === 0) {
      yield put({ payload, type: 'deleteSuccess' });
      yield put({ type: 'query' });
      message.info(`提交成功`);
    } else {
      Modal.error({
        content: dele.message || `提交失败，请稍后再试！`,
      });
    }
  },
};
model.effects = {
  ...model.effects,
  ...effects,
};
export default model;

export interface IpblacksState extends BaseState {
  list: any[];
}

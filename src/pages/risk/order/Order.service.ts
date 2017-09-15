import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/system/risk.orders/?${stringify(params)}`);
  // return Promise.resolve({
  //   state: 0,
  //   data: [
  //     {
  //       id: '1',
  //       company_name: 'string #公司名称',
  //       company_account: 'string #公司账号1',
  //       user_id: 'int #用户id',
  //       user_name: 'string #用户名',
  //       order_id: '529374',
  //       type: 2,
  //       created: (Date.now() / 1000) >> 0,
  //       comment: 'string #备注',
  //       state: 1,
  //     },
  //     {
  //       id: '2',
  //       company_name: 'string #公司名称',
  //       company_account: 'string #公司账号2',
  //       user_id: 'int #用户id',
  //       user_name: 'string #用户名',
  //       order_id: '49372',
  //       type: 1,
  //       created: (Date.now() / 1000) >> 0,
  //       comment: 'string #备注',
  //       state: 2,
  //     },
  //   ],
  // });
}

export async function createAjax(params: any) {
  return request(`/system/risk.orders/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/system/risk.orders/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/system/risk.orders/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

// 标记为正常或异常
export async function statusAjax(params: { ids: number[] }) {
  return request(`/system/risk.orders/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: { id: number }) {
  return request(`/system/risk.orders/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

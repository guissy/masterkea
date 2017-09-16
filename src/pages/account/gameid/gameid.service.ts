import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/game/accountlist?${stringify(params)}`);
}

export async function createAjax(params: any) {
  params.status = Number(params.status);
  return request(`/game/account/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/game/account/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/game/account`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/game/account?${stringify(params)}`, {
    method: 'DELETE',
  });
}
//游戏名称
export async function namesAjax(params: any) {
  return request(`/game/partner`);
}

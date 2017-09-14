import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/game/list/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/game/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/game/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/game/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}
export async function syncAjax(params: any) {
  // return request(`/game/info/`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(params),
  // });
  return Promise.resolve({
    state: 3,
    message: '功能正在出品中',
  });
}
export async function maintainAjax(params: any) {
  return request(`/game/maintain`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/game/status`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/game/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

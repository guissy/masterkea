import { stringify } from 'querystring';
import request from '../../utils/request';

export async function queryAjax(params: any) {
  return request(`/lottery/info/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/lottery/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/lottery/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

// 自动派奖
export async function updateAjax(params: any) {
  return request(`/lottery/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/lottery/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/lottery/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

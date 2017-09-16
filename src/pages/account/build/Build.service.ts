import { stringify } from 'querystring';
import request from '../../../utils/request';

// 创建完会请求一次
export async function queryAjax(params: any) {
  return request(`/hall/list/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/hall/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/build/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/build/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/build/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/build/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function buildAjax(params: any) {
  return request(`/hall/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

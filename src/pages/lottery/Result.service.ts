import { stringify } from 'querystring';
import request from '../../utils/request';

export async function queryAjax(params: any) {
  return request(`/lottery/result/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/lottery/result/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/lottery/result/?${stringify(params)}`);
}

// 彩票名称
export async function typeAjax(params: any) {
  return request(`/lottery/type?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/lottery/result/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/lottery/result/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/result/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

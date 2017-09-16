import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/stats/summary/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/summary/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/summary/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/summary/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/summary/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: { id: number }) {
  return request(`/summary/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

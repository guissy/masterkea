import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/stats/game/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/gameReport/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/gameReport/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/gameReport/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/gameReport/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: { id: number }) {
  return request(`/gameReport/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

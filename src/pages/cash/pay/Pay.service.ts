import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/pay/list?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/pay/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function updateAjax(params: any) {
  return request(`/pay/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/pay/status`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/pay/info?${stringify(params)}`, {
    method: 'DELETE',
  });
}

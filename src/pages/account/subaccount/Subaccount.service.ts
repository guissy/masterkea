import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/subaccount/list?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/subaccount/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/** @Unusable */
export async function updateAjax(params: any) {
  return request(`/subaccount/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function passwordAjax(params: any) {
  return request(`/subaccount/password`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/subaccount/status`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/subaccount/info?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function existsAjax(params: any) {
  return request(`/subaccount/exist?${stringify(params)}`);
}

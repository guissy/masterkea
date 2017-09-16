import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/periods/?${stringify(params)}`);
}

// 下拉列表中，其他模板
export async function periodsAjax(params: any) {
  return request(`/operation/period`);
}

export async function createAjax(params: any) {
  return request(`/periods/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/periods/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/periods/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/periods/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/periods/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

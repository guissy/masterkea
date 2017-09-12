import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/role/list?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/role/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function updateAjax(params: any) {
  return request(`/role/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}
export async function detailAjax(params: any) {
  return request(`/role/info?${stringify(params)}`);
}

// 取所有权限
export async function permissionAjax(params: any) {
  return request(`/role/info`, {
    method: 'GET',
  });
}

export async function deleteAjax(params: any) {
  return request(`/role/info?${stringify(params)}`, {
    method: 'DELETE',
  });
}

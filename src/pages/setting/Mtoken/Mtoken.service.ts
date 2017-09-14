import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/system/opts/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/system/opts/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/system/opts/?${stringify(params)}`);
}
// 编辑
export async function updateAjax(params: any) {
  return request(`/system/opts/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 改变switch状态
export async function statusAjax(params: any) {
  return request(`/system/opts/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/system/opts/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/system/ipblacks?${stringify(params)}`);
}

export async function createAjax(params: any) {
  params.status = Number(params.status);
  return request(`/system/ipblacks/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/system/ipblacks/?${stringify(params)}`);
}

// 改变状态
export async function updateAjax(params: any) {
  return request(`/system/ipblacks/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/system/ipblacks?${stringify(params)}`, {
    method: 'DELETE',
  });
}

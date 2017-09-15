import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/notice/list?${stringify(params)}`);
}

export async function infoAjax(params: any) {
  return request(`/notice/info?${stringify(params)}`);
}

export async function typeAjax(params: any) {
  return request(`/notice/type?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/notice/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function updateAjax(params: any) {
  return request(`/notice/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/notice/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/notice/info?${stringify(params)}`, {
    method: 'DELETE',
  });
}

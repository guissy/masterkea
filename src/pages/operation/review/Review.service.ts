import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/operation/reviews/?${stringify(params)}`);
}

export async function queryAjaxContent(params: any) {
  return request(`/operation/review/`, {
    method: 'GET',
    body: JSON.stringify(params),
  });
}

export async function createAjax(params: any) {
  return request(`/review/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax({ id }: any) {
  return request(`/operation/review/${id}`);
}

export async function updateAjax(params: any) {
  return request(`/review/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax({ id, status }: any) {
  return request(`/operation/review/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteAjax(params: any) {
  return request(`/review/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

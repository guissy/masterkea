import { stringify } from 'querystring';
import request from '../../utils/request';

export async function queryAjax(params: any) {
  return request(`/message/list?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/message/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function updateAjax(params: any) {
  return request(`/message/info`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function senderAjax(params: any) {
  return request(`/message/sender`);
}

export async function deleteAjax(params: any) {
  return request(`/message/info?${stringify(params)}`, {
    method: 'DELETE',
  });
}

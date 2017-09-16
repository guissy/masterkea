import { stringify } from 'querystring';
import request from '../../../utils/request';
import { AjaxState } from '../../../utils/Result';

export async function queryAjax(params: any) {
  return request(`/hall/operation/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/operation/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/hall/operation/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/operation/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function infoOpAjax(params: any) {
  /* if (params.status === 0) {
    return Promise.resolve({
      state: AjaxState.操作错误,
      message: '不允许设置为『未支付』！',
    });
  } else {*/
  return request(`/hall/operation/status/?${stringify(params)}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/operation/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

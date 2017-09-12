import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/hall/webset/config/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/hall/webset/config/`, {
    method: 'PUT',
    body: JSON.stringify({ data: params }),
  });
}

export async function infoAjax(params: any) {
  return request(`/hall/webset/update/?${stringify(params)}`);
}

export async function updateAjax({ id, ...params }: any) {
  return request(`/hall/webset/config/?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ data: params }),
  });
}

export async function statusAjax(params: any) {
  return request(`/webset/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/webset/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 负载级别
export async function thresholdAjax() {
  return request(`/hall/webset/threshold/`);
}

// 未占用的
export async function noAssignAjax() {
  return request(`/hall/webset/config/?page=1&page_size=99999&no_assign=1`);
}

// 绑定业务单元到厅主
export async function assignAjax(params: any) {
  return request(`/hall/webset/assign/?${stringify(params)}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

// 手册
export async function manualAjax(params: any) {
  return request(`/hall/webset/info/?${stringify(params)}`);
}

// 模板: 高级、中级、初级
export async function templatesAjax(params: any) {
  return request(`/hall/webset/threshold`);
}

import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryAjax(params: any) {
  return request(`/hall/list/?${stringify(params)}`);
}

export async function createAjax(params: any) {
  return request(`/hall/info/`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function infoAjax(params: any) {
  return request(`/hall/info/?${stringify(params)}`);
}

export async function updateAjax(params: any) {
  return request(`/hall/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function statusAjax(params: any) {
  return request(`/hall/status/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function deleteAjax(params: any) {
  return request(`/hall/info/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function simpleListAjax(params: any) {
  return request(`/hall/accountlist/?${stringify(params)}`);
}

export async function hallGameAjax(params: any) {
  return request(`/hall/game/?${stringify(params)}`);
}

export async function hallInfoAjax(params: any) {
  return request(`/hall/info/?${stringify(params)}`);
}

export async function hallLoginAjax(params: any) {
  return request(`/hall/account/?${stringify(params)}`);
}

// 编辑厅主信息
export async function saveHallInfoAjax(params: any) {
  return request(`/hall/info/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

// ip 白名单与上面是一样的
export const whitelistAjax = saveHallInfoAjax;

export async function saveHallGameAjax(params: any) {
  return request(`/hall/game/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function saveHallDomainAjax(params: any) {
  return request(`/hall/account/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function saveHallLoginAjax(params: any) {
  return request(`/hall/account/`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function sendMessageAjax(params: any) {
  return request(`/message/info`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function openBackendAjax(params: any) {
  return request(`/admin/loginhall?${stringify(params)}`);
}

// 厅主账号同名检测  "status": "int(required) #状态(1:账号已存在,0:账号不存在)"
export async function existAjax(params: any) {
  console.assert(params.info, '参数 info 不得为空');
  return request(`/hall/exist?${stringify(params)}`);
}
// 厅主登录账号同名检测  "status": "int(required) #状态(1:账号已存在,0:账号不存在)"
export async function accountExistAjax(params: any) {
  console.assert(params.account, '参数 account 不得为空');
  return request(`/hall/accountexist?${stringify(params)}`);
}

// 厅主账号同名检测
export async function prefixExistAjax(params: any) {
  console.assert(params.prefix, '参数 prefix 不得为空');
  return request(`/hall/prefixexist?${stringify(params)}`);
}

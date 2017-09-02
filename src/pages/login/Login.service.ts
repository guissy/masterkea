import request from '../../utils/request';

export async function loginAjax(params: any) {
  return request(`/admin/login`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function exitAjax(params: any) {
  return request(`/admin/logout`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function loginTwoAjax(params: any) {
  return request(`/admin/logintwo`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

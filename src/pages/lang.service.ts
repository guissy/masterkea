import request from '../utils/request';

export async function langAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}

export async function queryAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}
export async function createAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}
export async function updateAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}
export async function statusAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}
export async function deleteAjax(params: string) {
  return request(`/assets/lang/${params}.json`);
}

export async function langListAjax(params: string) {
  // TODO 多语言
  return request('/language');
}

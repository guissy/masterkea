import * as fetch from 'isomorphic-fetch';
import * as queryString from 'querystring';
import environment from './environment';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, options: RequestInit = {}) {
  const token = window.sessionStorage.getItem(environment.tokenName) || '';
  let pathname = window.location.pathname.substr(1);
  if (pathname === 'lottery/stage') {
    pathname = 'lottery/date';
  }
  // 需要授权访问的接口
  options.headers = {
    Authorization: `bearer ${token}`,
    'X-Request-Uri': pathname,
  } as any;
  if (!url.startsWith('http') && !url.endsWith('.json') && !url.startsWith('/api')) {
    // tslint:disable-next-line
    url = `${environment.hostAPI}${url}`;
  }
  const m = (options.method || '').toLocaleLowerCase();
  if (m === 'post' || m === 'put' || m === 'patch') {
    options.headers['Content-Type'] = 'application/json';
  }
  const queryFirst: { locale: string } = queryString.parse(location.search.slice(1)) as any;
  options.headers['Accept-Language'] = queryFirst.locale || window.localStorage.getItem('locale') || 'zh-CN';
  return fetch(url, options)
    .then((response: Response) => {
      let jsonObj;
      try {
        if (response.status === 401) {
          window.sessionStorage.clear();
          jsonObj = { status: 401, state: 4, message: '未授权' };
        } else if (response.status === 404) {
          jsonObj = { status: 404, state: 4, message: '404' };
        } else if (response.status === 405) {
          jsonObj = { status: 405, state: 4, message: '权限不足' };
        } else {
          jsonObj = response.json();
        }
      } catch (err) {
        console.error(err);
      }
      return jsonObj;
    })
    .catch(
      (err: any) =>
        String(err).includes('Failed to fetch')
          ? { status: 401, state: 4, message: '网络繁忙，请稍后重试！' }
          : { status: err && err.status, state: 3, message: err && err.message }
    );
}

let isDev = /^(192\.168|localhost)/.test(window.location.host);

isDev = false;

// 从全局读取配置，若读取不到则跳错误页
let enverr = false;
if (!(window.settings && window.settings.api)) {
  window.settings = { api: {} as any, site: {} as any, link: {} as any, logo: {} as any };
  if (!window.location.pathname.startsWith('/assets')) {
    window.location.href = '/assets/enverr.html';
    enverr = true;
  }
}

// 站点标题，favico, logo
document.title = window.settings.site.title || '';
const link = document.createElement('link');
link.rel = 'shortcut icon';
link.type = 'image/x-icon';
// link.href = window.settings.site.favicon || '/assets/favicon.ico';
document.head.appendChild(link);

const prefix = 'xlz_master_';
const environment = {
  prefix,
  enverr,
  production: !isDev,
  host: '',
  hostAPI: isDev ? 'http://master.las.com' : window.settings.api.url,
  tokenName: prefix + 'token',
  expiration: prefix + 'exp',
  tokenExp: prefix + 'token',
  adminInfo: prefix + 'admin',

  footerText: window.settings.site.copyright,
  openPages: ['/login'],
  page_size: 10,

  adminFirstPage: '/account/hall',
  upload: '',
  logo: window.settings.site.logo,
};

export default environment;

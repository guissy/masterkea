// import { message } from 'antd';
// import { EffectsCommandMap, SubscriptionAPI } from 'dva';
// import { routerRedux } from 'dva/router';
// import * as queryString from 'querystring';
// import { DvaAction } from '../../../typings/dva';
// import environment from '../../utils/environment';
// import { AjaxState, Result } from '../../utils/Result';
// import { BaseState, Store } from '../abstract/BaseModel';
import { MenuItem } from '../components/menu/Menus.model';
// import { exitAjax, loginAjax, loginTwoAjax } from './Login.service';

// export default {
//   namespace: 'login',
//   state: {
//     loading: false,
//     hasLogin: false,
//     hasLoginBefore: false,
//   },
//   subscriptions: {
//     setup({ dispatch, history }: SubscriptionAPI) {
//       // 刷新页面：已登录
//       let expiration = window.sessionStorage.getItem(environment.expiration);
//       if (!expiration) {
//         // 复制 localStorage 到 sessionStorage，与新开页面同步
//         expiration = JSON.parse(window.localStorage.getItem(environment.expiration));
//         if (expiration) {
//           window.sessionStorage.setItem(environment.tokenName, window.localStorage.getItem(environment.tokenName));
//           window.sessionStorage.setItem(environment.expiration, window.localStorage.getItem(environment.expiration));
//           window.sessionStorage.setItem(environment.adminInfo, window.localStorage.getItem(environment.adminInfo));
//         }
//       }
//       if (parseInt(expiration, 10) * 1000 - new Date().valueOf() > 0) {
//         // token 没过期
//         const adminInfo = JSON.parse(window.sessionStorage.getItem(environment.adminInfo));
//         if (adminInfo) {
//           // dispatch({ type: 'my/querySuccess', payload: adminInfo });
//           dispatch({
//             type: 'loginOneSuccess',
//             payload: { ...adminInfo, hasLogin: true, needLogin: false, hasLoginBefore: true },
//           });
//
//           // 有权限的菜单
//           if (adminInfo.route) {
//             const menu = Array.isArray(adminInfo.route) && adminInfo.route.map((v: MenuItem) => v.id);
//             const subs = adminInfo.route
//               .map((v: MenuItem) => v.children.map(w => w.id))
//               .reduce((s: MenuItem[], w: MenuItem[]) => s.concat(w));
//             dispatch({ type: 'menus/update', payload: { menu: menu.concat(subs) } });
//           }
//
//           if (location.pathname === '/login') {
//             dispatch(routerRedux.push(environment.adminFirstPage));
//           }
//         }
//       } else {
//         // 判断从 window.setting 是否正常
//         if (!environment.enverr) {
//           if (
//             location.pathname !== '/login' &&
//             !location.pathname.toLowerCase().includes('error') &&
//             !location.pathname.toLowerCase().includes('assets')
//           ) {
//             let from = location.pathname;
//             if (location.pathname === environment.adminFirstPage) {
//               from = environment.adminFirstPage;
//             }
//             window.location.href = `${location.origin}/login?from=${from}`;
//           }
//         }
//       }
//     },
//   },
//   effects: {
//     // 登录
//     *postLogin({ payload }: any, { call, put }: EffectsCommandMap) {
//       yield put({ type: 'changeLoading', payload: { loading: true } });
//       const result: LoginOneResult = yield call(loginAjax, { ...payload });
//       if (result && result.state === AjaxState.成功) {
//         yield put({
//           type: 'loginOneSuccess',
//           payload: {
//             visible: true,
//             loading: false,
//             mtoken: result.data.msg,
//             secret: result.data.secret,
//             id: result.data.uid,
//           },
//         });
//       } else {
//         console.warn('\u2714 Login.createWith login', 'login Fail');
//         yield put({ type: 'loginError', payload: { loading: false } });
//         message.error(result.message);
//       }
//     },
//     // 动态密码
//     *postLoginTwo({ payload }: any, { call, put, select }: EffectsCommandMap) {
//       const { id } = yield select(({ login }: Store) => login);
//       yield put({ type: 'changeLoading', payload: { loading: true } });
//       const result = yield call(loginTwoAjax, { ...payload, uid: id });
//       if (result && result.state === 0) {
//         yield put({ type: 'token', payload: result });
//       } else {
//         yield put({ type: 'loginError', payload: { loading: false } });
//         message.error(result.message);
//       }
//     },
//     // 保存登录状态
//     *token({ payload }: any, { put, select }: EffectsCommandMap) {
//       const result = payload as LoginedResult;
//       const admin: Admin = result.data.list;
//       admin.route = result.data.route;
//       // 缓存 token，请求时放在 Header 中
//       window.sessionStorage.setItem(environment.tokenName, result.data.token);
//       window.sessionStorage.setItem(environment.expiration, String(result.data.expire));
//       window.sessionStorage.setItem(environment.adminInfo, String(JSON.stringify(admin)));
//
//       // 有权限的菜单
//       if (admin.route) {
//         const menu = admin.route.map(v => v.id);
//         const subs = admin.route.map(v => v.children.map(w => w.id)).reduce((s, w) => s.concat(w));
//         yield put({ type: 'menus/update', payload: { menu: menu.concat(subs) } });
//       }
//
//       // 跳转到登录前的地址
//       const { lastMenu } = yield select(({ indexPage }: Store) => indexPage);
//       const from = queryString.parse(location.search).from || lastMenu || environment.adminFirstPage;
//       yield put(routerRedux.push(from));
//       yield put({ type: 'indexPage/changeLastMenu', payload: { lastMenu: [from] } });
//
//       // 保存当前管理员的个人资料
//       yield put({
//         type: 'postLoginSuccess',
//         payload: {
//           ...admin,
//           loading: false,
//           visible: false,
//           hasLogin: true,
//           hasLoginBefore: true,
//         },
//       });
//     },
//
//     // 退出账号，清理敏感信息
//     *logout({ payload }: any, { call, put }: EffectsCommandMap) {
//       try {
//         if (!payload || (payload && payload.needExit !== false)) {
//           yield call(exitAjax, payload); // 退出也要token, 不可先清token
//           yield put(routerRedux.push('/login'));
//         }
//         window.localStorage.removeItem(environment.tokenName);
//         window.localStorage.removeItem(environment.expiration);
//         window.localStorage.removeItem(environment.adminInfo);
//         window.sessionStorage.removeItem(environment.tokenName);
//         window.sessionStorage.removeItem(environment.expiration);
//         window.sessionStorage.removeItem(environment.adminInfo);
//         yield put({ type: 'exitSuccess', payload: { hasLogin: false } });
//       } catch (e) {
//         yield put({ type: 'exitSuccess', payload: { hasLogin: false } });
//       }
//     },
//   },
//
//   reducers: {
//     changeLoading(state: BaseState, action: DvaAction) {
//       return { ...state, ...action.payload };
//     },
//     loginOneSuccess(state: BaseState, action: DvaAction) {
//       return { ...state, ...action.payload };
//     },
//     postLoginSuccess(state: BaseState, action: DvaAction) {
//       return { ...state, ...action.payload };
//     },
//     loginError(state: BaseState, action: DvaAction) {
//       return { ...state, ...action.payload };
//     },
//     exitSuccess(state: BaseState, action: DvaAction) {
//       return { ...state, ...action.payload };
//     },
//   },
// };

export interface LoginState extends Admin {
  loading: boolean; // 提交中
  hasLogin: boolean; // 标识是否已登录
  hasLoginBefore: boolean; // 有可能过期

  visible: boolean; // 动态密码框
  mtoken: string; // 动态密码M令牌
  secret: string; // 动态密码M令牌
}
//
// interface LoginOneResult extends Result {
//   data: {
//     state: MtokenState;
//     msg: string;
//     secret: string;
//     uid: string;
//   };
// }
//
// interface LoginedResult extends Result {
//   data: {
//     list: Admin;
//     expire: number; // 时间戳
//     refresh_token: string;
//     token: string;
//     route: MenuItem[];
//   };
// }

interface Admin {
  id: string; // 有id表示登录密码OK，还需要验证动态密码
  username: string;
  truename: string;
  nick: string;

  logintime: string;
  role: number;
  route: MenuItem[];

  email: string;
  mobile: string;
  telephone: string;

  part: string;
  job: string;
  comment: string;
}
